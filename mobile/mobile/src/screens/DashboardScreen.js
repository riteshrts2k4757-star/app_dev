import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { colors } from '../theme/colors';

const DashboardScreen = () => {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.card} />

      {/* Greeting */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>{greeting}, Rajesh</Text>
          <Text style={styles.subtitle}>Trip FT-2026-001 · Dhanbad → Ranchi</Text>
        </View>
        <View style={styles.tripBadge}>
          <Text style={styles.tripBadgeText}>● Active</Text>
        </View>
      </View>

      {/* Container Status Banner */}
      <View style={styles.statusBanner}>
        <View style={styles.statusDot} />
        <View style={{ flex: 1 }}>
          <Text style={styles.statusTitle}>Container Status: SAFE</Text>
          <Text style={styles.statusSub}>Last synchronized 12 seconds ago</Text>
        </View>
      </View>

      {/* Sensor Cards */}
      <Text style={styles.sectionLabel}>LIVE SENSOR READINGS</Text>
      <View style={styles.sensorGrid}>
        <SensorCard label="Temperature" value="5.8°C" status="Normal" color={colors.info} />
        <SensorCard label="Humidity"    value="82.4%" status="Normal" color="#0369a1" />
        <SensorCard label="Ethylene"    value="1.2 ppm" status="Normal" color="#c2410c" />
        <SensorCard label="Battery"     value="87%"   status="Good"   color={colors.success} />
      </View>

      {/* Driver Status */}
      <Text style={styles.sectionLabel}>DRIVER STATUS</Text>
      <View style={styles.driverRow}>
        <View style={styles.driverCard}>
          <Text style={styles.driverCardLabel}>Driving</Text>
          <Text style={styles.driverCardValue}>04h 32m</Text>
        </View>
        <View style={styles.driverCard}>
          <Text style={styles.driverCardLabel}>Rest</Text>
          <Text style={[styles.driverCardValue, { color: colors.textMuted }]}>01h 15m</Text>
        </View>
      </View>

      <View style={styles.driverRow}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
          <Text style={styles.primaryButtonText}>Start Rest</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85}>
          <Text style={styles.outlineButtonText}>Add Event</Text>
        </TouchableOpacity>
      </View>

      {/* Connectivity */}
      <Text style={styles.sectionLabel}>CONNECTIVITY</Text>
      <View style={styles.card}>
        <ConnRow label="Gateway"  status="Connected" ok />
        <ConnRow label="MQTT"     status="Connected" ok />
        <ConnRow label="Internet" status="Connected" ok />
        <ConnRow label="Backend"  status="Connected" ok last />
      </View>
    </ScrollView>
  );
};

/* ---- Sub-components ---- */

const SensorCard = ({ label, value, status, color }) => (
  <View style={styles.sensorCard}>
    <View style={[styles.sensorIcon, { backgroundColor: color + '18' }]}>
      <View style={[styles.sensorIconDot, { backgroundColor: color }]} />
    </View>
    <Text style={styles.sensorLabel}>{label}</Text>
    <Text style={styles.sensorValue}>{value}</Text>
    <Text style={[styles.sensorStatus, { color: colors.success }]}>● {status}</Text>
  </View>
);

const ConnRow = ({ label, status, ok, last }) => (
  <View
    style={[
      styles.connRow,
      !last && { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
    ]}
  >
    <Text style={styles.connLabel}>{label}</Text>
    <View style={[styles.connBadge, { backgroundColor: ok ? colors.successBg : colors.dangerBg }]}>
      <Text style={[styles.connBadgeText, { color: ok ? colors.success : colors.danger }]}>
        ● {status}
      </Text>
    </View>
  </View>
);

/* ---- Styles ---- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 3,
  },
  tripBadge: {
    backgroundColor: colors.successBg,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 4,
  },
  tripBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.successBg,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  statusDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.success,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  statusSub: {
    fontSize: 12,
    color: colors.primaryDark,
    opacity: 0.7,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textLight,
    letterSpacing: 0.7,
    marginBottom: 10,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  sensorCard: {
    width: '47.5%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sensorIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  sensorIconDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  sensorLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  sensorValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginVertical: 2,
    letterSpacing: -0.5,
  },
  sensorStatus: {
    fontSize: 11,
    fontWeight: '600',
  },
  driverRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  driverCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  driverCardLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
    marginBottom: 6,
  },
  driverCardValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
  },
  outlineButtonText: {
    color: colors.text,
    fontWeight: '500',
    fontSize: 15,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  connRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
  },
  connLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textTransform: 'capitalize',
  },
  connBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  connBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default DashboardScreen;
