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
    Ionicons: ({ name }: any) => <RN.View testID={`icon-${name}`} />,
  };
});

jest.mock("@gluestack-ui/themed", () => {
  const React = require("react");
  const RN = require("react-native");

  const createViewMock = (displayName: string) => {
    const Comp = React.forwardRef(({ children, testID, onPress, ...props }: any, ref: any) => {
      if (displayName === "Button" || displayName === "Pressable") {
        return (
          <RN.Pressable onPress={onPress} {...props} testID={testID} accessibilityLabel={props.accessibilityLabel} ref={ref}>
            {children}
          </RN.Pressable>
        );
      }
      if (displayName === "Modal") {
        return props.isOpen ? <RN.View testID={testID}>{children}</RN.View> : null;
      }
      if (displayName === "InputField") return <RN.TextInput {...props} ref={ref} testID={testID} />;
      return <RN.View testID={testID} {...props}>{children}</RN.View>;
    });
    Comp.displayName = displayName;
    return Comp;
  };

  const createTextMock = (displayName: string) =>
    React.forwardRef(({ children, ...props }: any, ref: any) => <RN.Text ref={ref} {...props}>{children}</RN.Text>);

  return {
    Box: createViewMock("Box"),
    Button: createViewMock("Button"),
    ButtonText: ({ children, ...props }: any) => <RN.Text {...props}>{children}</RN.Text>,
    Center: createViewMock("Center"),
    Heading: ({ children, ...props }: any) => <RN.Text {...props}>{children}</RN.Text>,
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
    Text: ({ children, ...props }: any) => <RN.Text {...props}>{children}</RN.Text>,
    VStack: createViewMock("VStack"),
    GluestackUIProvider: ({ children }: any) => children,
    Image: RN.Image,
  };
});

jest.mock("@gluestack-style/react", () => ({
  StyledProvider: ({ children }: any) => children,
}));

jest.mock("@gluestack-ui/config", () => ({ config: {} }));
jest.mock("@legendapp/motion", () => ({}));
