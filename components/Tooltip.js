import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const Tooltip = ({ children, text }) => {
  const [visible, setVisible] = useState(false);
  const [layout, setLayout] = useState(null);
  const [tooltipSize, setTooltipSize] = useState({ width: 0, height: 0 });

  const targetRef = useRef(null);

  const openTooltip = () => {
    targetRef.current?.measureInWindow((x, y, width, height) => {
      setLayout({ x, y, width, height });
      setVisible(true);
    });
  };

  const closeTooltip = () => {
    setVisible(false);
    setLayout(null);
  };
  let left = 0;
  let top = 0;
  let placement = "right";

  if (layout && tooltipSize.width && tooltipSize.height) {
    const targetCenterY = layout.y + layout.height / 2;
    const targetCenterX = layout.x + layout.width / 2;
    const spaceRight = SCREEN_WIDTH - (layout.x + layout.width);
    const spaceLeft = layout.x;
    const spaceTop = layout.y;
    const spaceBottom = SCREEN_HEIGHT - (layout.y + layout.height);

    if (spaceRight >= tooltipSize.width + 8) {
      placement = "right";
    } else if (spaceLeft >= tooltipSize.width + 8) {
      placement = "left";
    } else if (spaceBottom >= tooltipSize.height + 8) {
      placement = "bottom";
    } else {
      placement = "top";
    }

    switch (placement) {
      case "right":
        left = layout.x + layout.width;
        top = layout.y + layout.height / 2 - tooltipSize.height / 2;
        break;

      case "left":
        left = layout.x - tooltipSize.width;
        top = layout.y + layout.height / 2 - tooltipSize.height / 2;
        break;

      case "bottom":
        left = layout.x + layout.width / 2 - tooltipSize.width / 2;
        top = layout.y + layout.height;
        break;

      case "top":
        left = layout.x + layout.width / 2 - tooltipSize.width / 2;
        top = layout.y - tooltipSize.height;
        break;
    }

    left = Math.max(8, Math.min(left, SCREEN_WIDTH - tooltipSize.width - 8));
    top = Math.max(8, Math.min(top, SCREEN_HEIGHT - tooltipSize.height - 8));
  }

  return (
    <>
      <TouchableOpacity ref={targetRef} onPress={openTooltip}>
        {children}
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="fade">
        <TouchableWithoutFeedback onPress={closeTooltip}>
          <View style={styles.overlay}>
            {layout && (
              <View
                style={[styles.tooltip, { top, left }]}
                onLayout={(e) =>
                  setTooltipSize({
                    width: e.nativeEvent.layout.width,
                    height: e.nativeEvent.layout.height,
                  })
                }
              >
                <Text style={styles.text}>{text}</Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "#ecedef",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    maxWidth: SCREEN_WIDTH * 0.7,
    overflow: "visible",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 8,
      },
    }),
  },
  text: {
    color: "#303030",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Montserrat_500Medium",
  },
});

export default Tooltip;
