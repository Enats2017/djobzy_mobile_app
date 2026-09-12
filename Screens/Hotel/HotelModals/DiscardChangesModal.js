import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BorderButton from '../../../components/BorderButton';
import GradientButton from '../../../components/GradientButton';

/**
 * DiscardChangesModal
 * A bottom-sheet confirmation shown when the user tries to leave a form
 * screen (back button, header arrow, Cancel button, swipe-back gesture)
 * while there is unsaved data in it.
 *
 * Props:
 * - visible: boolean
 * - onCancel: () => void      -> "Keep Editing" / close (X) — stay on screen
 * - onConfirm: () => void     -> "Yes, Discard" — proceed to leave
 * - title?: string
 * - message?: string
 */
export default function DiscardChangesModal({
  visible,
  onCancel,
  onConfirm,
  title = 'Discard changes?',
  message = "You have unsaved changes. If you leave now, they'll be lost.",
}) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity
            style={styles.closeBtn}
            activeOpacity={0.8}
            onPress={onCancel}
          >
            <Ionicons name="close" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.iconCircleOuter}>
            <View style={styles.iconCircleInner}>
              <Ionicons name="alert" size={28} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonGroup}>
            <GradientButton title="Yes, Discard" onPress={onConfirm} fontSize={18} />
            <BorderButton
              title="Keep Editing"
              onPress={onCancel}
              color="#303030"
              borderColor="#303030"
              fontSize={18}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    alignItems: "center",
  },
  closeBtn: {
    position: 'absolute',
    top: -20,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginLeft: "auto"
  },
  iconCircleOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FDEDED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircleInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E14C4C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#303030',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Montserrat_500Medium',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 22,
    paddingHorizontal: 8,
  },
  buttonGroup: {
    width: '100%',
  },
});
