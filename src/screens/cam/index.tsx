/* Core */
import { useRef, type ReactNode, useState } from "react";
import { Dimensions, TouchableWithoutFeedbackProps, View } from "react-native";

/* Expo */
import { Camera, CameraType, FlashMode } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

/* Custom Components */
import { TransparentButton, CustomText, TextButton } from "../../components";

/* Style */
import Style from "./index.style";
import { CameraButtonColor } from "../../common/colorPalette";
import FlashlightOn from "../../../assets/flash_on.svg";
import FlashlightOff from "../../../assets/flash_off.svg";
import X from "../../../assets/x.svg";
import Settings from "../../../assets/settings.svg";
import Gallery from "../../../assets/gallery2.svg";

/* Others */
import { logWithTime } from "../../utils/utils";

/* TODO: In some cases, screen might need to be considered here. */
const iconSize: number = Dimensions.get("window").width * 0.09;
const iconStyle: object = {
  /* SVG styles are not supported natively in StyleSheets */
  fill: CameraButtonColor.grey, // TODO: Find a better grey
};

// https://github.com/expo/examples
// https://github.com/expo/examples/blob/master/with-camera/App.js

/* ================ File Private Component Props ================ */
interface InformationTextProps {
  children: ReactNode;
}

interface CameraScreenButtonProps {
  onPress: TouchableWithoutFeedbackProps["onPress"];
}

interface CameraCloseButtonProps extends CameraScreenButtonProps {}

interface CameraSettingsButtonProps extends CameraScreenButtonProps {}

interface CameraFlashlightButtonProps extends CameraScreenButtonProps {
  flashMode: string;
}

interface CameraTopBarOnPress {
  onPressX?: TouchableWithoutFeedbackProps["onPress"];
  onPressFlashlight?: TouchableWithoutFeedbackProps["onPress"];
  onPressSettings?: TouchableWithoutFeedbackProps["onPress"];
}

interface CameraTopBarProps {
  isPermissionGranted: boolean | undefined;
  flashMode: string;
  onPressFunctions: CameraTopBarOnPress;
}

interface CamScreenProps {
  navigation: any; // TODO: Update the type according to the next navigation group
}
/* ================ End ================ */

/* ================ File Private Components ================ */
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

const CameraFlashlightButton: React.FC<CameraFlashlightButtonProps> = ({ flashMode, onPress }: CameraFlashlightButtonProps) => {
  const activeIcon = (_iconSize: number, _iconStyle: object) => {
    if (flashMode === "on") {
      return <FlashlightOff width={_iconSize} height={_iconSize} style={_iconStyle} />;
    }
    return <FlashlightOn width={_iconSize} height={_iconSize} style={_iconStyle} />;
  };

  return (
    <TransparentButton buttonStyle={Style.cameraButtonGeneric} touchableOpacityProps={{ onPress }}>
      {activeIcon(iconSize, iconStyle)}
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

const CameraTopBar: React.FC<CameraTopBarProps> = ({ isPermissionGranted, flashMode, onPressFunctions }: CameraTopBarProps) => {
  const { onPressX, onPressFlashlight, onPressSettings } = onPressFunctions;
  return (
    <View style={Style.cameraTopBarContainer}>
      <View style={Style.cameraTopBarInnerContainer}>
        <CameraCloseButton onPress={onPressX} />
        {isPermissionGranted && <CameraFlashlightButton flashMode={flashMode} onPress={onPressFlashlight} />}
        <CameraSettingsButton onPress={onPressSettings} />
      </View>
    </View>
  );
};
/* ================ End ================ */

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
export default function CamScreen({ navigation }: CamScreenProps) {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.off);
  const [currentImage, setCurrentImage] = useState<ImagePicker.ImagePickerAsset["base64"]>(null);

  const onPressX = () => {
    navigation.goBack();
  };

  const onPressFlashlight = (): void => {
    logWithTime("[onPressFlashlight]", flashMode);

    if (flashMode === FlashMode.off) {
      setFlashMode(FlashMode.on);
    } else {
      setFlashMode(FlashMode.off);
    }
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

  const onPressGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      // aspect: [9, 16], // Related to allowsEditing setting and works only on Android.
      selectionLimit: 1,
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      // console.log(result.assets[0].base64);
      setCurrentImage(result.assets[0].base64);
    }
  };

  if (!permission) {
    logWithTime("Awaiting for Camera...");
  }

  if (!permission?.granted) {
    logWithTime("Permission is not granted.");

    // TODO: Refactor here, merge with the main component.
    return (
      <View style={Style.container}>
        <CameraTopBar
          isPermissionGranted={permission?.granted}
          flashMode={FlashMode.off}
          onPressFunctions={{ onPressX, onPressSettings }}
        />
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
      <Camera style={Style.camera} type={CameraType.back} ref={cameraRef} flashMode={flashMode}>
        <CameraTopBar
          isPermissionGranted={permission?.granted}
          flashMode={flashMode}
          onPressFunctions={{ onPressX, onPressFlashlight, onPressSettings }}
        />
        <View style={Style.cameraBottomBarContainer}>
          <View style={Style.cameraBottomBarInnerContainer}>
            <View style={Style.cameraGalleryButtonContainer}>
              <TransparentButton
                touchableOpacityProps={{
                  onPress: onPressGallery,
                }}
              >
                <Gallery style={iconStyle} width={iconSize} height={iconSize} />
              </TransparentButton>
            </View>
            <TransparentButton
              touchableOpacityProps={{
                onPress: onPressCapture,
              }}
              buttonStyle={Style.cameraCaptureButton}
            ></TransparentButton>
            <Gallery width={iconSize} height={iconSize} />
          </View>
        </View>
      </Camera>
    </View>
  );
}
