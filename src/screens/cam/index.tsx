import { useRef, type ReactNode } from "react";
import { Dimensions, Image, Text, TouchableWithoutFeedbackProps, View } from "react-native";
import { Camera, CameraType } from "expo-camera";
import Style from "./index.style";
import { CameraButtonColor, TextColor } from "../../common/colorPalette";
import { logWithTime } from "../../utils/utils";
import { TransparentButton, CustomText, TextButton } from "../../components";
import FlashlightOn from "../../../assets/flash_on.svg";
import X from "../../../assets/x.svg";
import Settings from "../../../assets/settings.svg";

/* TODO: In some cases, screen might need to be considered here. */
const iconSize: number = Dimensions.get("window").width * 0.09;
const iconStyle: object = {
  /* SVG styles are not supported natively in StyleSheets */
  fill: CameraButtonColor.grey, // TODO: Find a better grey
};

// https://github.com/expo/examples
// https://github.com/expo/examples/blob/master/with-camera/App.js

interface InformationTextProps {
  children: ReactNode;
}

interface CameraScreenButtonProps {
  onPress: TouchableWithoutFeedbackProps["onPress"];
}

interface CameraCloseButtonProps extends CameraScreenButtonProps {}
interface CameraSettingsButtonProps extends CameraScreenButtonProps {}
interface CameraFlashlightButtonProps extends CameraScreenButtonProps {}

interface CameraTopBarOnPress {
  onPressX?: TouchableWithoutFeedbackProps["onPress"];
  onPressFlashlight?: TouchableWithoutFeedbackProps["onPress"];
  onPressSettings?: TouchableWithoutFeedbackProps["onPress"];
}

interface CameraTopBarProps {
  isPermissionGranted: boolean | undefined;
  onPressFunctions: CameraTopBarOnPress;
}

interface CamScreen {
  navigation: any; // TODO: Update the type according to the next navigation group
}

/* Local Components */
const InformationText: React.FC<InformationTextProps> = ({ children }: InformationTextProps) => {
  return <CustomText textStyle={Style.informationText}>{children}</CustomText>;
};

const CameraCloseButton: React.FC<CameraCloseButtonProps> = ({ onPress }: CameraCloseButtonProps) => {
  return (
    <TransparentButton buttonStyle={Style.cameraButtonGeneric} touchableOpacityProps={{ onPress }}>
      <X width={iconSize} height={iconSize} style={iconStyle} />
    </TransparentButton>
  );
};

const CameraFlashlightButton: React.FC<CameraFlashlightButtonProps> = ({ onPress }: CameraFlashlightButtonProps) => {
  return (
    <TransparentButton buttonStyle={Style.cameraButtonGeneric} touchableOpacityProps={{ onPress }}>
      <FlashlightOn width={iconSize} height={iconSize} style={iconStyle} />
    </TransparentButton>
  );
};

const CameraSettingsButton: React.FC<CameraSettingsButtonProps> = ({ onPress }: CameraSettingsButtonProps) => {
  return (
    <TransparentButton
      buttonStyle={{
        ...Style.cameraButtonGeneric,
        ...Style.cameraButtonRightEnd,
      }}
      touchableOpacityProps={{ onPress }}
    >
      <Settings width={iconSize} height={iconSize} style={iconStyle} />
    </TransparentButton>
  );
};

const CameraTopBar: React.FC<CameraTopBarProps> = ({ isPermissionGranted, onPressFunctions }: CameraTopBarProps) => {
  const { onPressX, onPressFlashlight, onPressSettings } = onPressFunctions;
  return (
    <View style={Style.cameraTopBarContainer}>
      <View style={Style.cameraTopBarInnerContainer}>
        <CameraCloseButton onPress={onPressX} />
        {isPermissionGranted && <CameraFlashlightButton onPress={onPressFlashlight} />}
        <CameraSettingsButton onPress={onPressSettings} />
      </View>
    </View>
  );
};

/**
  @note
  * If any error encounters in the future related to anything, change camera package and do not forget to remove expo-camera from build.gradle

  @logs
  * WARNING:Software Components will not be created automatically for Maven publishing from Android Gradle Plugin 8.0. 
  To opt-in to the future behavior, set the Gradle property android.disableAutomaticComponentCreation=true in the `gradle.properties` 
  file or use the new publishing DSL.
  * The Kotlin Gradle plugin was loaded multiple times in different subprojects, which is not supported and may break the build. 
  This might happen in subprojects that apply the Kotlin plugins with the Gradle 'plugins { ... }' DSL if they specify explicit versions, 
  even if the versions are equal.
  * Please add the Kotlin plugin to the common parent project or the root project, then remove the versions in the subprojects.
  * If the parent project does not need the plugin, add 'apply false' to the plugin line.
  * See: https://docs.gradle.org/current/userguide/plugins.html#sec:subprojects_plugins_dsl
  * The Kotlin plugin was loaded in the following projects: ':expo', ':expo-modules-core'
*/
export default function CamScreen({ navigation }: CamScreen) {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const onPressX = () => {
    navigation.goBack();
  };

  const onPressFlashlight = () => {
    logWithTime("[onPressFlashlight]");
  };

  const onPressSettings = () => {
    logWithTime("[onPressSettings]");
  };

  const onPressCapture = async () => {
    if (cameraRef.current) {
      /* Property 'takePictureAsync' does not exist on type 'never'. */
      /* @ts-ignore */
      const { uri, base64 } = await cameraRef.current.takePictureAsync({ base64: true });
      console.log(uri, base64);
    }
  };

  if (!permission) {
    logWithTime("Awaiting for Camera...");
  }

  if (!permission?.granted) {
    logWithTime("Permission is not granted.");

    return (
      <View style={Style.container}>
        <CameraTopBar isPermissionGranted={permission?.granted} onPressFunctions={{ onPressX, onPressSettings }} />
        <View style={Style.permissionContainer}>
          <InformationText>Could not access to camera.</InformationText>
          <View style={Style.row}>
            <InformationText>Click</InformationText>
            <InformationText> </InformationText>
            <TextButton touchableOpacityProps={{ onPress: requestPermission }}>here</TextButton>
            <InformationText> </InformationText>
            <InformationText>to grant permission.</InformationText>
          </View>
        </View>
      </View>
    );
  }

  if (permission) {
    logWithTime("Permission is granted.");
    console.log(permission);
  }

  return (
    <View style={Style.container}>
      <Camera style={Style.camera} type={CameraType.back} ref={cameraRef}>
        <CameraTopBar isPermissionGranted={permission?.granted} onPressFunctions={{ onPressX, onPressSettings }} />
        <View style={Style.cameraBottomBarContainer}>
          <View style={Style.cameraBottomBarInnerContainer}>
            <TransparentButton
              touchableOpacityProps={{
                onPress: onPressCapture,
              }}
              buttonStyle={Style.cameraCaptureButton}
            ></TransparentButton>
          </View>
        </View>
      </Camera>
    </View>
  );
}
