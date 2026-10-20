import { useSafeAreaInsets } from "react-native-safe-area-context";

const BASE_TAB_BAR_HEIGHT = 66;

export default function useBottomTabBarStyle(overrides = {}) {
  const insets = useSafeAreaInsets();

  return {
    ...overrides,
    height: BASE_TAB_BAR_HEIGHT + insets.bottom,
    paddingTop: 7,
    paddingBottom: Math.max(8, insets.bottom),
  };
}
