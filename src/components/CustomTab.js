import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";

const MIN_TAB_WIDTH = 100;

const CustomTabs = ({
  tabs = [],
  initialTabKey,
  onChange,
  containerStyle,
  tabBarStyle,
  contentStyle,
  activeTabStyle,
  inactiveTabStyle,
  activeTextStyle,
  inactiveTextStyle,
}) => {
  const [activeKey, setActiveKey] = useState(
    initialTabKey ?? tabs[0]?.key ?? null,
  );

  const [containerWidth, setContainerWidth] = useState(0);

  // Keep the active tab valid when tabs are added or removed.
  useEffect(() => {
    if (!tabs.length) {
      setActiveKey(null);
      return;
    }

    const exists = tabs.some((tab) => tab.key === activeKey);

    if (!exists) {
      const nextKey =
        initialTabKey && tabs.some((tab) => tab.key === initialTabKey)
          ? initialTabKey
          : tabs[0].key;

      setActiveKey(nextKey);
    }
  }, [tabs, activeKey, initialTabKey]);

  const tabWidth = Math.max(
    MIN_TAB_WIDTH,
    tabs.length > 0 && containerWidth > 0
      ? containerWidth / tabs.length
      : MIN_TAB_WIDTH,
  );

  const handleTabPress = (tab) => {
    setActiveKey(tab.key);
    onChange?.(tab.key, tab);
  };

  const activeTab = tabs.find((tab) => tab.key === activeKey);
  const ActiveScreen = activeTab?.component;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Tab Header */}
      <View
        style={[styles.tabBar, tabBarStyle]}
        onLayout={(event) => {
          setContainerWidth(event.nativeEvent.layout.width);
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.tabScrollContent}
        >
          {tabs.map((tab) => {
            const isActive = tab.key === activeKey;

            return (
              <Pressable
                key={tab.key}
                onPress={() => handleTabPress(tab)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                style={[
                  styles.tab,
                  { width: tabWidth },
                  isActive
                    ? [styles.activeTab, activeTabStyle]
                    : [styles.inactiveTab, inactiveTabStyle],
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    styles.tabText,
                    isActive
                      ? [styles.activeText, activeTextStyle]
                      : [styles.inactiveText, inactiveTextStyle],
                  ]}
                >
                  {tab.title}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Selected Tab Screen */}
      <View style={[styles.content, contentStyle]}>

        {ActiveScreen ? <ActiveScreen /> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: "#F0F0F2",
    borderRadius: 12,
    padding: 3,
    overflow: "hidden",
    minHeight: 40,
  },
  tabScrollContent: {
    alignItems: "stretch",
  },
  tab: {
    minHeight: 32,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 9,
  },
  activeTab: {
    backgroundColor: "#4980f5",
    elevation: 2,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  inactiveTab: {
    backgroundColor: "transparent",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  activeText: {
    color: "#fff",
  },
  inactiveText: {
    color: "#777783",
  },
  content: {
    flex: 1,
  },
});

export default CustomTabs;
