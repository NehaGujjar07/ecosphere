// Ensure Inter font is loaded for the UI
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

// Global Variables
let points = parseInt(localStorage.getItem('ecoPoints')) || 0;
const host = window.location.hostname;
const platform = host.includes("flipkart") ? "flipkart" : "amazon";

// ============================================
// PART 3: RULE ENGINE (FAST LAYER)
// ============================================

function detectCategory(text) {
  if (/\b(bottle|bottles|flask|flasks|mug|mugs)\b/i.test(text)) return "drinkware";
  if (/\b(chair|chairs|sofa|sofas|table|tables)\b/i.test(text)) return "furniture";
  if (/\b(shoe|shoes|sneaker|sneakers|footwear)\b/i.test(text)) return "footwear";
  if (/\b(t-shirt|tshirt|shirt|shirts|apparel|clothing|dress)\b/i.test(text)) return "clothing";
  if (/\b(bag|bags|handbag|purse|tote|backpack|wallet)\b/i.test(text)) return "accessories";
  if (/\b(trolley|suitcase|luggage)\b/i.test(text)) return "luggage";
  return "general";
}

function detectMaterial(text) {
  if (text.includes("cotton")) return "cotton";
  if (text.includes("polyester") || text.includes("synthetic") || text.includes("fabric")) return "synthetic";
  if (text.includes("steel") || text.includes("metal")) return "metal";
  if (text.includes("plastic") || text.includes("polycarbonate") || text.includes("abs")) return "plastic";
  if (text.includes("wood") || text.includes("bamboo")) return "wood";
  if (text.includes("organic")) return "organic";
  if (text.includes("leather")) return "leather";
  return "unknown";
}

// ============================================
// PART 4 & 5: HYBRID AI INTEGRATION
// ============================================

async function callGroqBackend(title, fullText, category, material) {
  try {
    const response = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        title: title.substring(0, 150), 
        fullText: fullText.substring(0, 1000), 
        category: category, 
        material: material 
      })
    });
    
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.error("AI Backend Error/Unreachable:", err);
  }
  return null;
}

// ============================================
// PART 6: CARBON ENGINE
// ============================================

function getCO2(material) {
  if (material === "plastic") return 3.5;
  if (material === "synthetic") return 3.0;
  if (material === "leather") return 4.0;
  if (material === "metal" || material === "steel") return 2.0;
  if (material === "cotton") return 1.5;
  if (material === "wood" || material === "organic") return 0.5;
  return 2.5; // average fallback
}

function getImpactLevel(co2) {
  if (co2 >= 3.0) return { label: "High", class: "impact-critical" };
  if (co2 >= 1.5) return { label: "Medium", class: "impact-high" };
  return { label: "Low", class: "" };
}

// ============================================
// UI & GAMIFICATION
// ============================================

function showMessage(msg, icon = "🌿", duration = 4000) {
  const oldPopup = document.getElementById('eco-popup-msg');
  if (oldPopup) oldPopup.remove();

  const popup = document.createElement('div');
  popup.id = 'eco-popup-msg';
  popup.className = 'eco-popup';
  popup.innerHTML = `<span>${icon}</span> <span>${msg}</span>`;
  document.body.appendChild(popup);

  setTimeout(() => popup.classList.add('show'), 10);
  setTimeout(() => {
    popup.classList.remove('show');
    setTimeout(() => popup.remove(), 400);
  }, duration);
}

function injectPanel(contentHTML) {
  const oldPanel = document.getElementById('eco-floating-panel');
  if (oldPanel) oldPanel.remove();

  const panel = document.createElement('div');
  panel.id = 'eco-floating-panel';
  panel.innerHTML = contentHTML;
  document.body.appendChild(panel);
}

function addPoints(pts, reason) {
  points += pts;
  localStorage.setItem('ecoPoints', points);
  showMessage(`+${pts} EcoPoints! (${reason})`, "🎯");
}

// ============================================
// PAGE SCRIPTS
// ============================================

// Clear old cache strictly for hackathon testing purposes
sessionStorage.clear();

function extractDOMData() {
  let title = "";
  let fullText = "";

  if (platform === "flipkart") {
    // Flipkart frequently changes its CSS classes (.B_NuCI, .VU-ZEz), so we add document.title as an ultimate fallback
    title = document.querySelector('.B_NuCI')?.innerText || document.querySelector('.VU-ZEz')?.innerText || document.title || "";
    const description = document.querySelector('.fMghEO')?.innerText || document.querySelector('.RzKnbQ')?.innerText || "";
    const highlights = document.querySelector('._1mXcCf')?.innerText || document.querySelector('.xFVion')?.innerText || "";
    const specs = document.querySelector('._1UhVsV')?.innerText || document.querySelector('._3dtsli')?.innerText || "";
    fullText = (title + " " + highlights + " " + description + " " + specs).toLowerCase();
  } else {
    // Amazon
    title = document.querySelector('#productTitle')?.innerText || document.title || "";
    const bullets = document.querySelector('#feature-bullets')?.innerText || document.querySelector('#feature-bullets-expander')?.innerText || "";
    const description = document.querySelector('#productDescription')?.innerText || "";
    fullText = (title + " " + bullets + " " + description).toLowerCase();
  }

  return { title, fullText };
}

async function runProductAnalysis() {
  setTimeout(async () => {
    const { title, fullText } = extractDOMData();
    if (!fullText.trim()) return;

    // 3. RULE ENGINE
    let category = detectCategory(fullText);
    let material = detectMaterial(fullText);

    // Initial Defaults (Fallback)
    let aiData = {
      material: material,
      alternative: null,
      alt_reason: "Fetching insights...",
      impact_reason: "Fetching environmental impact data..."
    };

    // CACHING LOGIC
    const cacheKey = "eco_cache_" + platform + "_" + encodeURIComponent(title.substring(0, 50));
    const cachedData = sessionStorage.getItem(cacheKey);

    let useCache = false;
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      // Ensure we don't cache fallback/failed AI states
      if (parsed.alternative !== "sustainable choice" && parsed.alternative !== "eco-friendly alternative") {
        aiData = parsed;
        useCache = true;
      }
    }

    if (!useCache) {
      // Show loading transient UI
      showMessage("🧠 Getting Ecosphere Insights...", "🤖", 2000);
      
      const groqResponse = await callGroqBackend(title, fullText, category, material);
      if (groqResponse) {
        aiData = groqResponse;
        // Only cache successful dynamic responses
        if (aiData.alternative !== "sustainable choice" && aiData.alternative !== "eco-friendly alternative") {
          sessionStorage.setItem(cacheKey, JSON.stringify(aiData));
        }
      }
    }

    // 6. CARBON ENGINE
    const co2 = getCO2(aiData.material);
    const ecoScore = Math.floor(Math.max(10, 100 - co2 * 18));
    const impact = getImpactLevel(co2);

    // 7. PRODUCT UI PANEL
    let html = `
      <div class="eco-header">
        <div class="eco-title">✨ Ecosphere Engine</div>
        <div style="font-size:12px; color:#9ca3af;">Points: ${points}</div>
      </div>
      
      <div class="eco-score-container">
        <div class="eco-score-value ${impact.class}">${ecoScore}</div>
        <div class="eco-score-max">/100</div>
      </div>
      
      <div class="eco-stats">
        <div class="eco-stat-row">
          <span class="eco-stat-label">Material</span>
          <span class="eco-stat-value" style="text-transform: capitalize;">${aiData.material}</span>
        </div>
        <div class="eco-stat-row">
          <span class="eco-stat-label">Category</span>
          <span class="eco-stat-value" style="text-transform: capitalize;">${category}</span>
        </div>
        <div class="eco-stat-row">
          <span class="eco-stat-label">Impact</span>
          <span class="eco-stat-value">${impact.label}</span>
        </div>
      </div>

      <div class="eco-comparison" style="margin-bottom: 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #d1d5db;">
        ℹ️ ${aiData.impact_reason}
      </div>
    `;

    if (co2 >= 3.0 || aiData.alternative) {
      const altTarget = aiData.alternative || "sustainable alternative";
      html += `
        <div class="eco-comparison" style="border-left: 3px solid #fbbf24;">
          ✨ <strong>Smart Alternative:</strong> <br/>
          Switch to ${altTarget}.<br/><br/>
          <span style="font-size:11px; opacity:0.8;">🤖 ${aiData.alt_reason}</span>
        </div>
        <button id="eco-btn-alternative" class="eco-btn eco-btn-warning" style="margin-top: 16px;">
          View better alternative
        </button>
      `;
      // Popups
      showMessage(`⚠️ High impact detected for this product`, "⚠️", 4000);
    } else {
      if (ecoScore >= 70) {
        html += `
          <div class="eco-comparison">
            💚 Excellent choice! This product aligns well with sustainable practices.
          </div>
        `;
        addPoints(10, "Sustainable product viewed");
      }
    }

    injectPanel(html);

    // Attach click events tailored to the platform
    if (document.getElementById('eco-btn-alternative')) {
      document.getElementById('eco-btn-alternative').addEventListener('click', () => {
        const searchPhrase = encodeURIComponent(aiData.alternative || "sustainable alternative");
        if (platform === "flipkart") {
          window.open(`https://www.flipkart.com/search?q=${searchPhrase}`);
        } else {
          window.open(`https://www.amazon.in/s?k=${searchPhrase}`);
        }
      });
    }

  }, 1500); // give DOM time to build
}

// 8. CART ANALYSIS
function runCartAnalysis() {
  setTimeout(() => {
    // Shared amazon classes vs flipkart's cart/checkout classes
    let itemNodes = Array.from(document.querySelectorAll('.sc-list-item, .a-row.sc-list-item, ._2I_0tX, ._2-uG6-, ._2K0v_S, div[data-tkid]'));
    
    // Fallback for Flipkart Checkout Page (which doesn't always use the standard cart classes)
    if (itemNodes.length === 0 && platform === "flipkart") {
      const allDivs = document.querySelectorAll('div');
      for (const div of allDivs) {
        if (div.innerText && div.innerText.toUpperCase().includes('REMOVE') && div.innerText.toUpperCase().includes('DELIVERY')) {
          // ensure it's a reasonably sized container, not the whole body
          if (div.innerText.length < 1500) {
            itemNodes.push(div);
          }
        }
      }
      // Deduplicate parent/child nodes safely
      itemNodes = [...new Set(itemNodes)];
    }

    console.log("Ecosphere: Found Cart Items ->", itemNodes.length);

    if (!itemNodes || itemNodes.length === 0) return;

    let cart = [];
    let originalTotalCO2 = 0;

    itemNodes.forEach(item => {
      const fullText = item.innerText ? item.innerText.toLowerCase() : "";
      if (!fullText.trim() || fullText.includes('place order')) return; // ignore entire page wrapper
      
      let quantity = 1; 
      const qtyEl = item.querySelector('.a-dropdown-prompt') || item.querySelector('input') || item.querySelector('._26qxdz');
      if (qtyEl) {
        const val = parseInt(qtyEl.innerText || qtyEl.value);
        if (!isNaN(val)) quantity = val;
      }

      const category = detectCategory(fullText);
      const material = detectMaterial(fullText);
      const co2 = getCO2(material);
      
      cart.push({ fullText, category, material, co2, quantity });
      originalTotalCO2 += co2 * quantity;
    });

    if (cart.length === 0) return;

    let html = `
      <div class="eco-header">
        <div class="eco-title">🛒 Cart Eco-Analysis</div>
        <div style="font-size:12px; color:#9ca3af;">Points: ${points}</div>
      </div>
      
      <div class="eco-stats">
        <div class="eco-stat-row">
          <span class="eco-stat-label">Total Items</span>
          <span class="eco-stat-value">${cart.reduce((a,b)=>a+b.quantity, 0)}</span>
        </div>
        <div class="eco-stat-row">
          <span class="eco-stat-label">Cart Emissions</span>
          <span class="eco-stat-value" id="cart-co2-val">${originalTotalCO2.toFixed(1)} kg CO₂</span>
        </div>
      </div>
    `;

    // Anything over threshold is optimizable
    const optimizableItemsCount = cart.filter(i => getCO2(i.material) >= 3.0).length;

    if (optimizableItemsCount > 0) {
      showMessage(`Your cart emits ${originalTotalCO2.toFixed(1)} kg CO₂`, "💨");
      html += `
        <div class="eco-comparison" id="eco-cart-suggestion">
          💡 Found ${optimizableItemsCount} item(s) that can be swapped for sustainable alternatives!
        </div>
        <button id="eco-btn-optimize" class="eco-btn eco-btn-primary" style="margin-top:16px;">
          ✨ Smart Optimize Cart
        </button>
      `;
    } else {
      html += `
        <div class="eco-comparison">
          💚 Your cart is fully optimized for sustainability!
        </div>
      `;
    }

    injectPanel(html);

    if (optimizableItemsCount > 0) {
      document.getElementById('eco-btn-optimize').addEventListener('click', () => {
        optimizeCart(cart, originalTotalCO2);
      });
    }

  }, 1500);
}

// 9. CART OPTIMIZATION
function optimizeCart(cart, originalTotalCO2) {
  // Use Rules for instant recalculation UX on Cart 
  const optimizedCart = cart.map(item => {
    if (getCO2(item.material) >= 3.0) {
      return {
        ...item,
        reducedCO2: 1.5, // simulate switching to cotton or steel
        optimized: true
      };
    }
    return item;
  });

  const optimizedCO2 = optimizedCart.reduce((sum, item) => {
    return sum + ((item.optimized ? item.reducedCO2 : item.co2) * item.quantity);
  }, 0);

  const reduction = originalTotalCO2 - optimizedCO2;
  const reductionPct = Math.round((reduction / originalTotalCO2) * 100);

  document.getElementById('cart-co2-val').innerHTML = `
    <span style="text-decoration:line-through; font-size: 11px; color:#9ca3af;">${originalTotalCO2.toFixed(1)}kg</span> 
    <span style="color:#34d399;">${optimizedCO2.toFixed(1)} kg</span>
  `;
  
  const suggestionBox = document.getElementById('eco-cart-suggestion');
  suggestionBox.innerHTML = `
    <div style="color:#34d399; font-weight:600; margin-bottom:8px;">✅ Switched alternatives intelligently!</div>
    <div style="font-size:12px; color:#f3f4f6;">
      Reduction: <strong>${reduction.toFixed(1)} kg (${reductionPct}%)</strong>
    </div>
  `;
  suggestionBox.style.background = 'rgba(52, 211, 153, 0.1)';
  suggestionBox.style.borderColor = 'rgba(52, 211, 153, 0.2)';

  const btn = document.getElementById('eco-btn-optimize');
  btn.innerText = "Cart Optimized 🎉";
  btn.style.background = "#1f2937";
  btn.style.color = "#a7f3d0";
  btn.style.pointerEvents = 'none';

  // 10. POPUPS
  showMessage(`🌱 You reduced emissions by ${reductionPct}%!`, "🏆", 4000);
  setTimeout(() => {
    // 11. GAMIFICATION
    addPoints(20, "Smart Cart Optimization Engine");
  }, 1500);
}

// ROUTER & PLATFORM DETECTION
console.log("Ecosphere Extension Loaded! Platform:", platform, "URL:", window.location.href);

if (platform === "amazon") {
  if (window.location.href.includes("/cart") || window.location.href.includes("cart.html") || window.location.href.includes("cart?_encoding=UTF8")) {
    runCartAnalysis();
  } else if (window.location.href.includes("/dp/") || window.location.href.includes("/gp/product")) {
    runProductAnalysis();
  }
} else if (platform === "flipkart") {
  if (window.location.href.includes("/viewcart") || window.location.href.includes("/checkout")) {
    runCartAnalysis();
  } else if (window.location.href.includes("/p/itm") || window.location.href.includes("/p/")) {
    runProductAnalysis();
  }
}
