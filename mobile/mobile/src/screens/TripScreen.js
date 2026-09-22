import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Alert
} from 'react-native';
import { colors } from '../theme/colors';

const trips = [
  {
    id: 'FT-2026-001',
    origin: 'Dhanbad',
    destination: 'Ranchi',
    status: 'active',
    date: '21 Sep 2026',
    alerts: 2,
    records: 1024,
  },
  {
    id: 'FT-2026-000',
    origin: 'Kolkata',
    destination: 'Dhanbad',
    status: 'completed',
    date: '18 Sep 2026',
    alerts: 0,
    records: 2048,
  },
];

const TripScreen = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.card} />

      <TouchableOpacity style={styles.newTripBtn} activeOpacity={0.85} onPress={() => Alert.alert('New Trip', 'Creating a new trip...')}>
        <Text style={styles.newTripBtnText}>+ Start New Trip</Text>
      </TouchableOpacity>

      <Text style={styles.sectionLabel}>ALL SHIPMENTS</Text>

      {trips.map(trip => (
        <TouchableOpacity key={trip.id} style={styles.tripCard} activeOpacity={0.85} onPress={() => Alert.alert('Trip Info', `Selected trip ${trip.id}`)}>
          <View style={styles.tripHeader}>
            <Text style={styles.tripId}>{trip.id}</Text>
            <View
              style={[
                styles.badge,
                trip.status === 'active' ? styles.badgeActive : styles.badgeDone,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: trip.status === 'active' ? colors.success : colors.textMuted },
                ]}
              >
                {trip.status === 'active' ? '● Active' : 'Completed'}
              </Text>
            </View>
          </View>

          <Text style={styles.tripRoute}>
            {trip.origin} → {trip.destination}
          </Text>

          <View style={styles.tripMeta}>
            <Text style={styles.tripMetaText}>{trip.date}</Text>
            <Text style={styles.tripMetaDot}>·</Text>
            <Text style={styles.tripMetaText}>{trip.records.toLocaleString()} records</Text>
            {trip.alerts > 0 && (
              <>
                <Text style={styles.tripMetaDot}>·</Text>
                <Text style={[styles.tripMetaText, { color: colors.warning, fontWeight: '600' }]}>
                  {trip.alerts} alerts
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>
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
    paddingTop: 16,
    paddingBottom: 32,
  },
  newTripBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
    minHeight: 48,
  },
  newTripBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textLight,
    letterSpacing: 0.7,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  tripCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 10,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  tripId: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeActive: {
    backgroundColor: colors.successBg,
  },
  badgeDone: {
    backgroundColor: colors.borderLight,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tripRoute: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 10,
  },
  tripMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  tripMetaText: {
    fontSize: 12,
    color: colors.textLight,
  },
  tripMetaDot: {
    fontSize: 12,
    color: colors.textLight,
  },
});

export default TripScreen;
