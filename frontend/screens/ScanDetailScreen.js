import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize } from '../components/theme';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';

export default function ScanDetailScreen({ navigation, route }) {
  const imageUrl = route.params?.imageUrl;
  const scanResult = route.params?.scanResult;
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const result = {
    name: scanResult?.name || 'Scanned Food',
    accuracy: scanResult?.accuracy || 0,
    topPredictions: scanResult?.topPredictions || [],
    objectCounts: scanResult?.objectCounts || {},
    detectionData: scanResult?.detectionData || { totalDetections: 0, allDetections: [] },
  };

  // Get image dimensions
  useEffect(() => {
    if (imageUrl) {
      Image.getSize(imageUrl, (width, height) => {
        setImageDimensions({ width, height });
      });
    }
  }, [imageUrl]);

  // Format object counts as readable text: "3 telur, 2 nasi"
  const getObjectCountsText = () => {
    if (!result.objectCounts || Object.keys(result.objectCounts).length === 0) {
      return 'No objects detected';
    }
    return Object.entries(result.objectCounts)
      .map(([label, count]) => `${count} ${label}`)
      .join(', ');
  };

  // Draw bounding boxes - scale bbox coordinates to display size
  const getBoundingBoxes = () => {
    if (!result.detectionData?.allDetections || !imageDimensions.width) return [];
    
    const DISPLAY_WIDTH = 340; // Image container width
    const DISPLAY_HEIGHT = 340; // Image container height (square)
    
    const scaleX = DISPLAY_WIDTH / imageDimensions.width;
    const scaleY = DISPLAY_HEIGHT / imageDimensions.height;

    return result.detectionData.allDetections
      .filter(det => det.bbox)
      .map((det, idx) => {
        const [x1, y1, x2, y2] = det.bbox;
        return {
          x: x1 * scaleX,
          y: y1 * scaleY,
          width: (x2 - x1) * scaleX,
          height: (y2 - y1) * scaleY,
          label: det.label,
          idx,
        };
      });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Details</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Main Food Image with Annotations */}
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            {imageUrl ? (
              <>
                <Image 
                  source={{ uri: imageUrl }} 
                  style={styles.foodImage} 
                  resizeMode="cover" 
                />
                {/* ✅ SVG Bounding Boxes Overlay */}
                <Svg
                  width={340}
                  height={340}
                  style={styles.svgOverlay}
                >
                  {getBoundingBoxes().map((box, idx) => (
                    <React.Fragment key={idx}>
                      {/* Bounding Box Rectangle */}
                      <Rect
                        x={box.x}
                        y={box.y}
                        width={box.width}
                        height={box.height}
                        fill="none"
                        stroke={Colors.accent}
                        strokeWidth="2"
                      />
                      {/* Label Background */}
                      <Rect
                        x={box.x}
                        y={Math.max(0, box.y - 25)}
                        width={Math.min(340 - box.x, box.label.length * 6 + 10)}
                        height="20"
                        fill={Colors.accent}
                      />
                      {/* Label Text */}
                      <SvgText
                        x={box.x + 5}
                        y={Math.max(15, box.y - 8)}
                        fontSize="12"
                        fontWeight="bold"
                        fill="white"
                      >
                        {box.label} ({(box.idx + 1)})
                      </SvgText>
                    </React.Fragment>
                  ))}
                </Svg>
              </>
            ) : (
              <Text style={styles.imagePlaceholder}>[FOOD IMAGE]</Text>
            )}
          </View>
          
          {/* Object Count Badge */}
          {result.detectionData?.totalDetections > 0 && (
            <View style={styles.detectionSummary}>
              <View style={styles.detectionBadge}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.white} />
                <Text style={styles.detectionText}>
                  {result.detectionData.totalDetections} object{result.detectionData.totalDetections > 1 ? 's' : ''} detected
                </Text>
              </View>
              <Text style={styles.objectCountText}>{getObjectCountsText()}</Text>
            </View>
          )}

          <View style={styles.mainPredictionBadge}>
            <Text style={styles.mainFoodName}>{result.name}</Text>
            <Text style={styles.mainAccuracy}>{result.accuracy}% confidence</Text>
          </View>
        </View>

        {/* Detected Items Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="search" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Top Detection</Text>
          </View>

          {result.topPredictions && result.topPredictions.length > 0 ? (
            <View style={styles.predictionsContainer}>
              {/* Only show TOP 1 detection */}
              {(() => {
                const pred = result.topPredictions[0];
                const confidencePercent = Math.round(pred.confidence * 100);
                
                return (
                  <View key={0} style={[styles.predictionCard, styles.predictionCardTop]}>
                    <View style={styles.predictionHeader}>
                      <View style={styles.rankBadge}>
                        <Ionicons name="checkmark-circle" size={24} color={Colors.white} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.predictionName}>{pred.label}</Text>
                        <Text style={styles.predictionType}>
                          🎯 Primary Detection
                        </Text>
                      </View>
                      <View style={styles.confidenceBadge}>
                        <Text style={styles.confidenceText}>{confidencePercent}%</Text>
                      </View>
                    </View>

                    {/* Confidence Bar */}
                    <View style={styles.confidenceBarContainer}>
                      <View style={styles.confidenceBarBackground}>
                        <View
                          style={[
                            styles.confidenceBarFill,
                            {
                              width: `${confidencePercent}%`,
                              backgroundColor: Colors.primary,
                            },
                          ]}
                        />
                      </View>
                    </View>

                    {/* Detection Details */}
                    <View style={styles.confidenceDetails}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Certainty:</Text>
                        <Text style={[
                          styles.detailValue,
                          { color: confidencePercent >= 80 ? Colors.primary : confidencePercent >= 50 ? Colors.accent : '#EF4444' }
                        ]}>
                          {confidencePercent >= 80 ? '🟢 High' : confidencePercent >= 50 ? '🟡 Medium' : '🔴 Low'}
                        </Text>
                      </View>
                      
                      {/* Show bbox if available */}
                      {pred.bbox && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Position:</Text>
                          <Text style={styles.detailValue}>
                            ({Math.round(pred.bbox[0])}, {Math.round(pred.bbox[1])})
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })()}
            </View>
          ) : (
            <View style={styles.noPredictionsContainer}>
              <Text style={styles.noPredictionsText}>No predictions available</Text>
            </View>
          )}
        </View>

        {/* Information Box */}
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>
              The AI model shows its top 3 predictions for the detected food item.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.backToResultBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={18} color={Colors.primary} />
            <Text style={styles.backToResultText}>Back to Result</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.rescanBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="camera" size={18} color={Colors.white} />
            <Text style={styles.rescanText}>Rescan</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: Colors.white 
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },

  scrollContent: {
    flexGrow: 1,
    backgroundColor: Colors.white,
  },

  imageContainer: {
    padding: Spacing.lg,
    backgroundColor: '#F3F4F6',
  },

  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: Spacing.md,
    position: 'relative',
  },

  foodImage: {
    width: '100%',
    height: '100%',
  },

  svgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  mainPredictionBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
  },

  mainFoodName: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },

  mainAccuracy: {
    fontSize: FontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },

  detectionSummary: {
    marginBottom: Spacing.md,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },

  detectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },

  detectionText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.white,
  },

  objectCountText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 22,
  },

  sectionContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },

  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
  },

  predictionsContainer: {
    gap: Spacing.md,
  },

  predictionCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  predictionCardTop: {
    backgroundColor: '#FFFBEB',
    borderColor: Colors.primary,
    borderWidth: 2,
  },

  predictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },

  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rankNumber: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.white,
  },

  predictionName: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },

  predictionType: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },

  confidenceBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    minWidth: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  confidenceText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.white,
  },

  confidenceBarContainer: {
    marginVertical: Spacing.sm,
  },

  confidenceBarBackground: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },

  confidenceBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  confidenceDetails: {
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  detailLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: '500',
  },

  detailValue: {
    fontSize: FontSize.xs,
    color: Colors.text,
    fontWeight: '600',
  },

  noPredictionsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
  },

  noPredictionsText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },

  infoBox: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    padding: Spacing.md,
  },

  infoRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },

  infoText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.text,
    lineHeight: 16,
  },

  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },

  backToResultBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },

  backToResultText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.primary,
  },

  rescanBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: Spacing.md,
  },

  rescanText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.white,
  },
});
