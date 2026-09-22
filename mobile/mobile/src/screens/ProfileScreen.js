import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { colors } from '../theme/colors';

const ProfileScreen = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.card} />

      {/* Avatar + Name */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>RK</Text>
        </View>
        <Text style={styles.name}>Rajesh Kumar</Text>
        <Text style={styles.role}>DRIVER001 · Driver</Text>
      </View>

      {/* Info Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Information</Text>
        <InfoRow label="Phone"        value="+91 9876543210" />
        <InfoRow label="Vehicle"      value="JH10AB1234" />
        <InfoRow label="Current Trip" value="FT-2026-001" />
        <InfoRow label="Driving Today" value="04h 32m" last />
      </View>

      {/* Stats */}
      <Text style={styles.sectionLabel}>PERFORMANCE</Text>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>24</Text>
          <Text style={styles.statLabel}>Trips</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.success }]}>98%</Text>
          <Text style={styles.statLabel}>Safety</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>7</Text>
          <Text style={styles.statLabel}>Alerts</Text>
        </View>
      </View>

      {/* Settings Links */}
      <View style={styles.card}>
        <SettingsRow label="Gateway Settings" />
        <SettingsRow label="MQTT Configuration" />
        <SettingsRow label="Alert Thresholds" />
        <SettingsRow label="Export Data" />
        <SettingsRow label="About FarmTrace" last />
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ label, value, last }) => (
  <View style={[infoStyles.row, !last && { borderBottomWidth: 1, borderBottomColor: colors.borderLight }]}>
    <Text style={infoStyles.label}>{label}</Text>
    <Text style={infoStyles.value}>{value}</Text>
  </View>
);

const SettingsRow = ({ label, last }) => (
  <TouchableOpacity
    style={[settingsStyles.row, !last && { borderBottomWidth: 1, borderBottomColor: colors.borderLight }]}
    activeOpacity={0.7}
  >
    <Text style={settingsStyles.label}>{label}</Text>
    <Text style={settingsStyles.chevron}>›</Text>
  </TouchableOpacity>
);

/* ---- Styles ---- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#BBF7D0',
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  role: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 3,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginBottom: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textLight,
    letterSpacing: 0.7,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
    fontWeight: '500',
  },
});

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
});

const settingsStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    minHeight: 48,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  chevron: {
    fontSize: 22,
    color: colors.textLight,
  },
});

export default ProfileScreen;
