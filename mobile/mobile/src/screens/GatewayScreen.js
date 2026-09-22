import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, DeviceEventEmitter, Alert, PermissionsAndroid } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import WifiManager from 'react-native-wifi-reborn';
import { colors } from '../theme/colors';

const GatewayScreen = () => {
  const [sysState, setSysState] = useState({
    nodemcuWifi: false,
    nodemcuApi: false,
    internet: false,
    mqtt: false,
    backend: false,
  });

  const [wifiName, setWifiName] = useState('Checking...');
  const [ipAddress, setIpAddress] = useState('---.---.---.---');

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('SystemStateChange', (s) => setSysState({ ...s }));
    
    fetchWifiDetails();
    const unsubscribe = NetInfo.addEventListener(state => {
      fetchWifiDetails(state);
    });

    return () => {
      sub.remove();
      unsubscribe();
    };
  }, []);

  const fetchWifiDetails = async (state) => {
    const netState = state || await NetInfo.fetch();
    if (netState.type === 'wifi' && netState.details) {
      setWifiName(netState.details.ssid || 'Unknown SSID');
      setIpAddress(netState.details.ipAddress || 'Unknown IP');
    } else {
      setWifiName('Not connected to WiFi');
      setIpAddress('---.---.---.---');
    }
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'FarmTrace needs location access to scan for WiFi networks.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const connectToGateway = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location permission is required to connect to WiFi.');
      return;
    }

    try {
      Alert.alert('Connecting...', 'Attempting to connect to FarmTrace_Gateway...');
      await WifiManager.connectToProtectedSSID('FarmTrace_Gateway', 'farmtrace123', false, false);
      Alert.alert('Success', 'Connected to Gateway WiFi');
      fetchWifiDetails();
    } catch (error) {
      Alert.alert('Connection Failed', 'Could not connect to FarmTrace_Gateway. Make sure the NodeMCU is powered on.');
      console.error(error);
    }
  };

  const isConnected = sysState.nodemcuWifi;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Status Banner */}
      <View style={[styles.banner, isConnected ? styles.bannerSafe : styles.bannerDanger]}>
        <View style={[styles.bannerDot, { backgroundColor: isConnected ? colors.success : colors.danger }]} />
        <View>
          <Text style={styles.bannerTitle}>
            {isConnected ? 'Gateway Connected' : 'Gateway Disconnected'}
          </Text>
          <Text style={styles.bannerSub}>
            {isConnected ? 'Receiving sensor data from container' : 'Turn on the FarmTrace gateway'}
          </Text>
        </View>
      </View>

      {/* Connection Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Connection Details</Text>
        <InfoRow label="Wi-Fi Network" value={wifiName} />
        <InfoRow label="IP Address" value={ipAddress} />
        <InfoRow label="API Status" value={sysState.nodemcuApi ? 'OK' : 'Error'} />
        <InfoRow label="Internet" value={sysState.internet ? 'Connected' : 'Offline'} />
        <InfoRow label="MQTT Bridge" value={sysState.mqtt ? 'Active' : 'Disconnected'} highlight={!sysState.mqtt} />
      </View>

      {/* Connection Steps (shown when not connected) */}
      {!isConnected && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Connect Container</Text>
          <StepItem num="1" title="Turn on the FarmTrace Gateway" desc="Power the ESP32 device near the container." done />
          <StepItem num="2" title="Connect your phone" desc="Join the FarmTrace_Gateway Wi-Fi." active />
          <StepItem num="3" title="Container detected" desc="The app detects sensors automatically." />
          <StepItem num="4" title="Start monitoring" desc="Begin your trip with live data." />
        </View>
      )}

      {/* Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.outlineBtn} onPress={connectToGateway}>
          <Text style={styles.outlineBtnText}>Auto-Connect</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.outlineBtn, { borderColor: colors.danger }]} onPress={() => Alert.alert('Gateway', 'Disconnected from Gateway.')}>
          <Text style={[styles.outlineBtnText, { color: colors.danger }]}>Disconnect</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
};


const InfoRow = ({ label, value, highlight }) => (
  <View style={infoStyles.row}>
    <Text style={infoStyles.label}>{label}</Text>
    <Text style={[infoStyles.value, highlight && { color: colors.warning }]}>{value}</Text>
  </View>
);

const StepItem = ({ num, title, desc, done, active }) => (
  <View style={stepStyles.item}>
    <View style={[
      stepStyles.num,
      done && { backgroundColor: colors.primary, borderColor: colors.primary },
      active && { borderColor: colors.primary },
    ]}>
      <Text style={[stepStyles.numText, done && { color: '#fff' }, active && { color: colors.primary }]}>
        {done ? '✓' : num}
      </Text>
    </View>
    <View style={stepStyles.body}>
      <Text style={stepStyles.title}>{title}</Text>
      <Text style={stepStyles.desc}>{desc}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
  },
  bannerSafe: {
    backgroundColor: colors.successBg,
    borderColor: '#BBF7D0',
  },
  bannerDanger: {
    backgroundColor: colors.dangerBg,
    borderColor: '#FECACA',
  },
  bannerDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  bannerSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  outlineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  outlineBtnText: {
    fontWeight: '500',
    fontSize: 15,
    color: colors.text,
  },
});

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  label: { fontSize: 13, color: colors.textMuted },
  value: { fontSize: 13, fontWeight: '600', color: colors.text },
});

const stepStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  num: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numText: {
    fontWeight: '700',
    fontSize: 13,
    color: colors.textMuted,
  },
  body: { flex: 1 },
  title: { fontSize: 14, fontWeight: '600', color: colors.text },
  desc: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
});

export default GatewayScreen;
