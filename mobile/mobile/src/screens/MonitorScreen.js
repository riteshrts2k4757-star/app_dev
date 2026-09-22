import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, DeviceEventEmitter } from 'react-native';
import { colors } from '../theme/colors';

const MonitorScreen = () => {
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('NewSensorData', (data) => {
      setSensorData(data);
    });
    return () => sub.remove();
  }, []);

  const sensors = [
    { label: 'Temperature', value: sensorData?.temperature ? `${sensorData.temperature}°C` : '--', min: '4.2°C', max: '7.1°C', status: 'Normal', color: colors.info },
    { label: 'Humidity',    value: sensorData?.humidity ? `${sensorData.humidity}%` : '--', min: '78%',   max: '85%',   status: 'Normal', color: '#0369a1' },
    { label: 'Ethylene',    value: sensorData?.mq6 ? `${sensorData.mq6} ppm` : '--', min: null, max: null, status: 'Normal', color: '#c2410c' },
    { label: 'Battery',     value: sensorData?.battery ? `${sensorData.battery}%` : '--', min: null, max: null, status: 'Good',   color: colors.success },
    { label: 'Vibration',   value: sensorData?.mpu6050 ? 'Active' : '--',  min: null, max: null, status: 'Normal', color: '#7c3aed' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.card} />

      {/* Live indicator */}
      <View style={styles.liveRow}>
        <View style={[styles.liveDot, { backgroundColor: colors.success }]} />
        <Text style={styles.liveText}>Live · Updated {sensorData ? 'recently' : 'unknown'}</Text>
      </View>

      {sensors.map((s, i) => (
        <View key={i} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: s.color + '18' }]}>
              <View style={[styles.iconDot, { backgroundColor: s.color }]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sensorLabel}>{s.label}</Text>
              <Text style={styles.sensorValue}>{s.value}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: colors.successBg }]}>
              <Text style={[styles.statusText, { color: colors.success }]}>● {s.status}</Text>
            </View>
          </View>

          {(s.min || s.max) && (
            <View style={styles.minMaxRow}>
              <View style={styles.minMaxItem}>
                <Text style={styles.minMaxLabel}>Min</Text>
                <Text style={styles.minMaxVal}>{s.min}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.minMaxItem}>
                <Text style={styles.minMaxLabel}>Max</Text>
                <Text style={styles.minMaxVal}>{s.max}</Text>
              </View>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-start',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  liveText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  sensorLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
    marginBottom: 2,
  },
  sensorValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  minMaxRow: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  minMaxItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: 8,
  },
  minMaxLabel: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '500',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  minMaxVal: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});

export default MonitorScreen;
