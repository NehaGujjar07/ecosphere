import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, Text, View, KeyboardAvoidingView, Platform,
  Dimensions, ActivityIndicator, ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOW } from '../../theme/Theme';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function ScannerScreen() {
  const [productSearch, setProductSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const openCamera = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please allow camera access to scan barcodes.',
          [{ text: 'OK' }]
        );
        return;
      }
    }
    setScanned(false);
    setCameraActive(true);
  };

  const handleBarcodeScanned = ({ type, data }) => {
    if (scanned) return;
    setScanned(true);
    setCameraActive(false);
    setProductSearch(data);
    // Trigger analysis automatically after scan
    analyzeProduct(data);
  };

  const analyzeProduct = async (barcodeOverride) => {
    const barcode = barcodeOverride || productSearch;
    if (!barcode) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('http://localhost:8000/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult({ error: "Failed to connect to the EcoSphere AI server." });
    }
    setLoading(false);
  };

  const resetScanner = () => {
    setResult(null);
    setProductSearch('');
    setScanned(false);
    setCameraActive(false);
  };

  // CAMERA VIEW
  if (cameraActive) {
    return (
      <View style={styles.cameraScreen}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'qr', 'code128', 'code39'] }}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        >
          {/* Header */}
          <View style={styles.cameraHeader}>
            <TouchableOpacity onPress={() => setCameraActive(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.cameraHeaderText}>Scan Barcode</Text>
            <View style={{ width: 44 }} />
          </View>

          {/* Aim overlay */}
          <View style={styles.overlay}>
            <View style={styles.overlayTop} />
            <View style={styles.overlayMiddle}>
              <View style={styles.overlaySide} />
              <View style={styles.scanFrame}>
                {/* Corners */}
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
                {/* Scan line */}
                <View style={styles.scanLine} />
              </View>
              <View style={styles.overlaySide} />
            </View>
            <View style={styles.overlayBottom}>
              <Text style={styles.scanHint}>Align barcode within the frame</Text>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>AI Scanner</Text>
          <Text style={styles.subtitle}>Scan a product barcode to get its sustainability score</Text>
        </View>

        {!result && !loading && (
          <>
            {/* Camera Trigger Button */}
            <TouchableOpacity style={styles.cameraButton} onPress={openCamera} activeOpacity={0.85}>
              <View style={styles.cameraIconRing}>
                <Ionicons name="camera" size={42} color={COLORS.primary} />
              </View>
              <Text style={styles.cameraButtonTitle}>Scan with Camera</Text>
              <Text style={styles.cameraButtonSub}>Tap to open camera & scan a barcode</Text>
              <View style={styles.cameraButtonBadge}>
                <Ionicons name="flash" size={12} color={COLORS.primary} />
                <Text style={styles.cameraButtonBadgeText}>AI-Powered</Text>
              </View>
            </TouchableOpacity>

            {/* OR divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or enter manually</Text>
              <View style={styles.dividerLine} />
            </View>

            <InputField
              icon="barcode-outline"
              placeholder="Enter barcode (e.g. 3017620422003)"
              value={productSearch}
              onChangeText={setProductSearch}
            />

            <PrimaryButton
              title="Analyze Product"
              onPress={() => analyzeProduct()}
              style={styles.scanButton}
            />
          </>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingTitle}>Analyzing Product</Text>
              <Text style={styles.loadingText}>Eco-AI is analyzing sustainability impact...</Text>
            </View>
          </View>
        )}

        {result && !loading && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultsHeader}>Analysis Complete</Text>
            <View style={styles.resultCard}>
              {result.error ? (
                <Text style={styles.errorText}>{result.error}</Text>
              ) : (
                <>
                  <View style={styles.scoreRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.productName}>{result.product_name}</Text>
                      <Text style={styles.brandName}>{result.brand}</Text>
                    </View>
                    <View style={[styles.scoreCircle, { backgroundColor: result.score > 6 ? '#D1FAE5' : result.score > 4 ? '#FEF3C7' : '#FEE2E2' }]}>
                      <Text style={[styles.scoreText, { color: result.score > 6 ? '#065F46' : result.score > 4 ? '#92400E' : '#991B1B' }]}>
                        {result.score}/10
                      </Text>
                    </View>
                  </View>

                  <View style={styles.insightBox}>
                    <Ionicons name="cloud-outline" size={16} color="#0369A1" />
                    <Text style={styles.insightText}>Carbon Impact: {result.breakdown.carbon_impact}</Text>
                  </View>

                  <View style={styles.insightBox}>
                    <Ionicons name="cube-outline" size={16} color="#B45309" />
                    <Text style={styles.insightText}>Packaging: {result.breakdown.material_impact}</Text>
                  </View>

                  {result.breakdown.risk_indicators?.length > 0 && (
                    <View style={styles.riskBox}>
                      <Text style={styles.riskTitle}>Risk Indicators:</Text>
                      {result.breakdown.risk_indicators.map((r, i) => (
                        <Text key={i} style={styles.riskItem}>• {r}</Text>
                      ))}
                    </View>
                  )}

                  {result.breakdown.suggestions?.length > 0 && (
                    <View style={styles.suggestionBox}>
                      <Text style={styles.suggestionTitle}>Smart Suggestion:</Text>
                      {result.breakdown.suggestions.map((s, i) => (
                        <Text key={i} style={styles.suggestionItem}>• {s}</Text>
                      ))}
                    </View>
                  )}
                </>
              )}
            </View>

            <View style={styles.resultActions}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={openCamera}>
                <Ionicons name="camera-outline" size={18} color={COLORS.primary} />
                <Text style={styles.secondaryBtnText}>Scan Again</Text>
              </TouchableOpacity>
              <PrimaryButton
                title="New Product"
                onPress={resetScanner}
                style={styles.newProductBtn}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const FRAME_SIZE = width * 0.65;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.l,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 100,
  },
  header: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },

  // ── Camera trigger card ──────────────────────────────────────
  cameraButton: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    borderStyle: 'dashed',
    ...SHADOW.medium,
  },
  cameraIconRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.m,
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
  },
  cameraButtonTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: 4,
  },
  cameraButtonSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  cameraButtonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.round,
    marginTop: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  cameraButtonBadgeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: 4,
  },

  // ── Divider ──────────────────────────────────────────────────
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    paddingHorizontal: SPACING.m,
  },
  scanButton: {
    marginTop: SPACING.m,
  },

  // ── Loading ──────────────────────────────────────────────────
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.xl,
  },
  loadingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    width: '100%',
    ...SHADOW.medium,
  },
  loadingTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginTop: SPACING.l,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginTop: SPACING.s,
    textAlign: 'center',
  },

  // ── Results ──────────────────────────────────────────────────
  resultContainer: { flex: 1 },
  resultsHeader: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.m,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.l,
    padding: SPACING.l,
    ...SHADOW.large,
  },
  errorText: { color: '#DC2626', textAlign: 'center' },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  productName: { ...TYPOGRAPHY.h3, color: COLORS.text },
  brandName: { ...TYPOGRAPHY.caption, color: COLORS.textMuted },
  scoreCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: { ...TYPOGRAPHY.h3, fontWeight: 'bold' },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
    backgroundColor: '#F3F4F6',
    padding: SPACING.s,
    borderRadius: RADIUS.s,
  },
  insightText: { marginLeft: SPACING.s, ...TYPOGRAPHY.caption, color: COLORS.text },
  riskBox: {
    marginTop: SPACING.m,
    backgroundColor: '#FEF2F2',
    padding: SPACING.m,
    borderRadius: RADIUS.s,
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },
  riskTitle: { ...TYPOGRAPHY.caption, fontWeight: 'bold', color: '#991B1B', marginBottom: 4 },
  riskItem: { ...TYPOGRAPHY.small, color: '#991B1B' },
  suggestionBox: {
    marginTop: SPACING.m,
    backgroundColor: '#ECFDF5',
    padding: SPACING.m,
    borderRadius: RADIUS.s,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  suggestionTitle: { ...TYPOGRAPHY.caption, fontWeight: 'bold', color: '#065F46', marginBottom: 4 },
  suggestionItem: { ...TYPOGRAPHY.small, color: '#065F46' },
  resultActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xl,
    gap: SPACING.m,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.l,
    paddingVertical: 14,
    borderRadius: RADIUS.round,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    ...SHADOW.small,
  },
  secondaryBtnText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  newProductBtn: { flex: 1 },

  // ── Full-screen Camera ────────────────────────────────────────
  cameraScreen: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.m,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraHeaderText: {
    ...TYPOGRAPHY.h3,
    color: '#FFF',
    fontWeight: 'bold',
  },

  // ── Barcode aim overlay ───────────────────────────────────────
  overlay: { flex: 1 },
  overlayTop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  overlayMiddle: { flexDirection: 'row' },
  overlaySide: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  scanFrame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE * 0.65,
    position: 'relative',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    paddingTop: SPACING.xl,
  },
  scanHint: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.8)',
  },
  scanLine: {
    position: 'absolute',
    top: '50%',
    width: '100%',
    height: 2,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#FFF',
    borderWidth: 3,
  },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 6 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 6 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 6 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 6 },
});
