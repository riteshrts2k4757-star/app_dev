import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { colors } from '../theme/colors';

const events = [
  { time: '14:20', title: 'Delivery Checkpoint', desc: 'Arrived at checkpoint B',        dot: colors.primary },
  { time: '12:15', title: 'Driving',             desc: 'Resumed driving after rest',     dot: colors.primary },
  { time: '11:30', title: 'Rest',                desc: 'Rest period — 45 minutes',       dot: colors.warning },
  { time: '09:45', title: 'Driving',             desc: 'Started driving — Highway NH-2', dot: colors.primary },
  { time: '08:10', title: 'Vehicle Inspection',  desc: 'All systems clear',              dot: colors.info },
  { time: '08:00', title: 'Trip Started',        desc: 'Origin: Dhanbad warehouse',      dot: colors.success },
];

const LogbookScreen = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.card} />

      {/* Trip summary */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Driving</Text>
          <Text style={styles.summaryValue}>04h 32m</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Rest</Text>
          <Text style={styles.summaryValue}>01h 15m</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: colors.successBg, borderColor: '#BBF7D0' }]}>
          <Text style={[styles.summaryLabel, { color: colors.primaryDark }]}>Status</Text>
          <Text style={[styles.summaryValue, { color: colors.success, fontSize: 13 }]}>● Driving</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlRow}>
        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>Start Rest</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.85}>
          <Text style={styles.outlineBtnText}>Add Event</Text>
        </TouchableOpacity>
      </View>

      {/* Timeline */}
      <Text style={styles.sectionLabel}>TODAY'S TIMELINE</Text>
      <View style={styles.timelineCard}>
        {events.map((ev, i) => (
          <View key={i} style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View style={[styles.timelineDot, { backgroundColor: ev.dot }]} />
              {i < events.length - 1 && <View style={styles.timelineLine} />}
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTime}>{ev.time}</Text>
              <Text style={styles.timelineTitle}>{ev.title}</Text>
              <Text style={styles.timelineDesc}>{ev.desc}</Text>
            </View>
          </View>
        ))}
      </View>
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
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  controlRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  outlineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
  },
  outlineBtnText: {
    color: colors.text,
    fontWeight: '500',
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
  timelineCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 14,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 14,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: 4,
    marginBottom: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 18,
  },
  timelineTime: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '500',
    marginBottom: 2,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  timelineDesc: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
});

export default LogbookScreen;
