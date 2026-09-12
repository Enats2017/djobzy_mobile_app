import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Reusable refund policy table.
 *
 * Props:
 *  - rules: [{ before: '10', refund: '10' }, ...]  (same shape as your
 *    parsed `refund_rules` field — strings or numbers both work)
 *  - onInfoPress: optional — called when the "?" icon is tapped
 *    (e.g. to show an explainer tooltip/modal)
 */
const HotelRefundPolicyCard = ({ rules = [], onInfoPress }) => {
    if (!rules.length) return null;

    return (
        <View style={styles.wrap}>
            <View style={styles.table}>
                <View style={styles.headerRow}>
                    <Text style={[styles.headerCell, styles.leftCell]}>Before (days)</Text>
                    <Text style={[styles.headerCell, styles.rightCell]}>Refund %</Text>
                </View>

                {rules.map((rule, index) => (
                    <View
                        key={index}
                        style={[
                            styles.row,
                            index === rules.length - 1 && styles.rowLast,
                        ]}
                    >
                        <Text style={[styles.cell, styles.leftCell]}>{rule.before} days</Text>
                        <Text style={[styles.cell, styles.rightCell]}>{rule.refund}%</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default HotelRefundPolicyCard;

const styles = StyleSheet.create({
    wrap: {
        marginBottom: 20,
    },
    table: {
        borderWidth: 1,
        borderColor: '#dadada',
        borderRadius: 8,
        overflow: 'hidden',
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#ececec',
        borderBottomWidth: 1,
        borderBottomColor: '#edecef',
    },
    headerCell: {
        flex: 1,
        fontSize: 14,
        lineHeight: 19,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000000',
        paddingVertical: 12,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ececec',
    },
    rowLast: {
        borderBottomWidth: 0,
    },
    cell: {
        flex: 1,
        fontSize: 14,
        lineHeight: 19,
        fontFamily: 'Montserrat_500Medium',
        color: '#303030',
        paddingVertical: 12,
        textAlign: 'center',
    },
    leftCell: {
        borderRightWidth: 1,
        borderRightColor: '#ececec',
    },
    rightCell: {},
});