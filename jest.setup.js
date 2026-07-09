jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

const mockAddEventListener = jest.fn(() => jest.fn());
jest.mock("@react-native-community/netinfo", () => ({
  __esModule: true,
  default: {
    addEventListener: mockAddEventListener,
    fetch: jest.fn(() => Promise.resolve({ isConnected: true, isInternetReachable: true })),
  },
}));

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const RN = require("react-native");
  return {
    Ionicons: ({ name }) => React.createElement(RN.View, { testID: `icon-${name}` }),
  };
});

jest.mock("@gluestack-ui/themed", () => {
  const React = require("react");
  const RN = require("react-native");

  function createViewMock(displayName) {
    const Comp = React.forwardRef(function ViewMock({ children, testID, onPress, ...props }, ref) {
      if (displayName === "Button" || displayName === "Pressable") {
        return React.createElement(
          RN.Pressable,
          { onPress, ...props, testID, accessibilityLabel: props.accessibilityLabel, ref },
          children,
        );
      }
      if (displayName === "Modal") {
        return props.isOpen ? React.createElement(RN.View, { testID }, children) : null;
      }
      if (displayName === "InputField") {
        return React.createElement(RN.TextInput, { ...props, ref, testID });
      }
      return React.createElement(RN.View, { testID, ...props }, children);
    });
    Comp.displayName = displayName;
    return Comp;
  }

  function TextMock({ children, ...props }) {
    return React.createElement(RN.Text, props, children);
  }

  return {
    Box: createViewMock("Box"),
    Button: createViewMock("Button"),
    ButtonText: TextMock,
    Center: createViewMock("Center"),
    Heading: TextMock,
    HStack: createViewMock("HStack"),
    Input: createViewMock("Input"),
    InputField: createViewMock("InputField"),
    Modal: createViewMock("Modal"),
    ModalBackdrop: createViewMock("ModalBackdrop"),
    ModalBody: createViewMock("ModalBody"),
    ModalContent: createViewMock("ModalContent"),
    ModalFooter: createViewMock("ModalFooter"),
    ModalHeader: createViewMock("ModalHeader"),
    Pressable: createViewMock("Pressable"),
    Progress: createViewMock("Progress"),
    ProgressFilledTrack: createViewMock("ProgressFilledTrack"),
    ScrollView: RN.ScrollView,
    Spinner: createViewMock("Spinner"),
    Text: TextMock,
    VStack: createViewMock("VStack"),
    GluestackUIProvider: function Provider({ children }) { return children; },
    Image: RN.Image,
  };
});

jest.mock("@gluestack-style/react", () => ({
  StyledProvider: function StyledProvider({ children }) { return children; },
}));

jest.mock("@gluestack-ui/config", () => ({ config: {} }));
jest.mock("@legendapp/motion", () => ({}));
