/* Core */
import { useRef, type ReactNode, useState, useEffect } from "react";
import { Dimensions, TouchableOpacityProps, View } from "react-native";

/* Expo */
import { Image } from "expo-image";
import { Camera, CameraType, FlashMode } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

/* Custom Components */
import { TransparentButton, CustomText, TextButton } from "../../../components";

/* Store */
import { useAppDispatch } from "../../../store/hooks";
import { resetBook, updateImageInStore } from "../../../store/slices/bookSlice";

/* Style */
import Style from "./index.style";
import { CameraButtonColor } from "../../../common/colorPalette";
import { SettingsIcon, XIcon, SendIcon, FlashOnIcon, FlashOffIcon, GalleryIcon } from "../../../../assets";

/* Others */
import { addPrefixToBase64, logJSON, logWithTime } from "../../../utils/utils";
import { TBase64 } from "../../../types/commonTypes";
import { imageLibraryOptions } from "../../../common/options";
import { isIOS } from "../../../common/common";

/* TODO: In some cases, screen might need to be considered here. */
const iconSize: number = Dimensions.get("window").width * 0.09;
const iconStyle: object = {
  /* SVG styles are not supported natively in StyleSheets */
  fill: CameraButtonColor.grey, // TODO: Find a better grey
};

// https://github.com/expo/examples
// https://github.com/expo/examples/blob/master/with-camera/App.js

/* ================ File Private Types ================ */
type TRequestPermission = () => Promise<ImagePicker.PermissionResponse>;

/* ================ File Private Component Props ================ */
interface InformationTextProps {
  children: ReactNode;
}

interface CameraScreenButtonProps {
  onPress: TouchableOpacityProps["onPress"];
}

interface CameraCloseButtonProps extends CameraScreenButtonProps {}

interface CameraSettingsButtonProps extends CameraScreenButtonProps {}

interface CameraFlashlightButtonProps extends CameraScreenButtonProps {
  flashMode: string;
}

interface CameraTopBarOnPress {
  onPressX?: TouchableOpacityProps["onPress"];
  onPressFlashlight?: TouchableOpacityProps["onPress"];
  onPressSettings?: TouchableOpacityProps["onPress"];
}

interface CameraTopBarProps {
  isPermissionGranted: boolean;
  isImageDisplayOn: boolean;
  flashMode: string;
  onPressFunctions: CameraTopBarOnPress;
}

interface PermissionContainerProps {
  requestPermission: TRequestPermission;
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
      <XIcon width={iconSize} height={iconSize} style={iconStyle} />
    </TransparentButton>
  );
};

const CameraFlashlightButton: React.FC<CameraFlashlightButtonProps> = ({ flashMode, onPress }: CameraFlashlightButtonProps) => {
  /* Local Function */
  const activeIcon = (_iconSize: number, _iconStyle: object) => {
    if (flashMode === "on") {
      return <FlashOffIcon width={_iconSize} height={_iconSize} style={_iconStyle} />;
    }
    return <FlashOnIcon width={_iconSize} height={_iconSize} style={_iconStyle} />;
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
      <SettingsIcon width={iconSize} height={iconSize} style={iconStyle} />
    </TransparentButton>
  );
};

const CameraTopBar: React.FC<CameraTopBarProps> = ({
  isPermissionGranted,
  isImageDisplayOn, // This data using for preventing flashlight attempts when image is displayed.
  flashMode,
  onPressFunctions,
}: CameraTopBarProps) => {
  const { onPressX, onPressFlashlight, onPressSettings } = onPressFunctions;
  return (
    <View style={Style.cameraTopBarContainer}>
      <View style={Style.cameraTopBarInnerContainer}>
        <CameraCloseButton onPress={onPressX} />
        {isPermissionGranted && !isImageDisplayOn && <CameraFlashlightButton flashMode={flashMode} onPress={onPressFlashlight} />}
        <CameraSettingsButton onPress={onPressSettings} />
      </View>
    </View>
  );
};

const PermissionContainer: React.FC<PermissionContainerProps> = ({ requestPermission }: PermissionContainerProps) => {
  return (
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
  const [currentImage, setCurrentImage] = useState<TBase64>(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean>(false);
  const [isImageDisplayOn, setIsImageDisplayOn] = useState<boolean>(false);
  // const [isCameraReady, setIsCameraReady] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    logWithTime("[CameraScreen] Mounted.");
    dispatch(resetBook());

    return () => {
      logWithTime("[CameraScreen] Unmounted.");
    };
  }, []);

  useEffect(() => {
    /* To handle the situation only basic as 'granted or not' 
    to prevent unpredictable errors that other falsy values (null | undefined) can cause. */
    setIsPermissionGranted(!!permission?.granted);
  }, [permission]);

  // TODO: Only run on real devices, since simulator is not supported by expo-camera
  // https://docs.expo.dev/versions/latest/sdk/device/
  // https://stackoverflow.com/questions/34727912/react-native-how-can-i-detect-if-my-code-is-running-in-the-simulator
  // useEffect(() => {
  //   if (currentImage) {
  //     cameraRef.current.pausePreview();
  //   } else {
  //     /*
  //       Error: Calling the 'resumePreview' function has failed
  //       Caused by: This operation is not supported on the simulator
  //     */
  //     cameraRef.current.resumePreview();
  //   }
  // }, [currentImage]);

  const updateImage = (base64Text: TBase64): void => {
    let updatedBase64Text = null;

    if (base64Text) {
      updatedBase64Text = addPrefixToBase64(base64Text);
    }

    setCurrentImage(updatedBase64Text);
    dispatch(updateImageInStore(updatedBase64Text));
    setIsImageDisplayOn(!!updatedBase64Text);
  };

  /* ================ onPress Events ================ */
  // const onCameraReady = () => {
  //   TODO: Does not work with emulator but required for real devices.
  //   logWithTime("Camera is set.");
  //   setIsCameraReady(true);
  // };

  const onPressX = () => {
    if (currentImage) {
      // If on the screen, there's an image; instead of closing the camera screen, unmount image.
      updateImage(null);
    } else {
      navigation.goBack();
    }
  };

  const onPressFlashlight = (): void => {
    logWithTime("[onPressFlashlight]", flashMode);

    if (flashMode === FlashMode.off) {
      setFlashMode(FlashMode.on);
    } else {
      setFlashMode(FlashMode.off);
    }
  };

  const onPressSettings = (): void => {
    logWithTime("[onPressSettings]");
  };

  const onPressCapture = async (): Promise<void> => {
    if (cameraRef.current) {
      /* Property 'takePictureAsync' does not exist on type 'never'. */
      /* @ts-ignore */
      const { base64 } = await cameraRef.current.takePictureAsync({ base64: true });

      updateImage(base64);
    }
  };

  const onPressGallery = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync(imageLibraryOptions);

    if (!result.canceled) {
      updateImage(result.assets[0].base64);
    }
  };

  const onPressSend = (): void => {
    logWithTime("[onPressSend]");
    navigation.navigate("MainApp", { screen: "DetailsScreen" });
  };

  // TODO: onSwipeLeft, navigation.goBack()
  /* ================ End ================ */

  if (!permission) {
    logWithTime("Awaiting for Camera...");
  }

  if (permission) {
    logJSON(permission, "Permission");
  }

  if (permission?.granted) {
    logWithTime("Permission is granted.");
  }

  return (
    <View style={Style.container}>
      <Camera
        style={Style.camera}
        type={CameraType.back}
        ref={cameraRef}
        flashMode={flashMode}
        // onCameraReady={onCameraReady}
      >
        {currentImage && <Image style={Style.image} source={{ uri: currentImage }} />}
        {/* iOS and Android handles absolute containers different, that's why there 2 different render conditions with the same components, the same props. */}
        {!isIOS && (
          <CameraTopBar
            isPermissionGranted={isPermissionGranted}
            isImageDisplayOn={isImageDisplayOn}
            flashMode={flashMode}
            onPressFunctions={{ onPressX, onPressFlashlight, onPressSettings }}
          />
        )}
        {/* In Android, Permission Screen is covering all the screen and zIndex value does not effect on items if topbar is rendered after permission screen */}
        {!isPermissionGranted && <PermissionContainer requestPermission={requestPermission} />}
        {/* But, in iOS, it should be rendered after PermissionScreen to use zIndex properly. */}
        {isIOS && (
          <CameraTopBar
            isPermissionGranted={isPermissionGranted}
            isImageDisplayOn={isImageDisplayOn}
            flashMode={flashMode}
            onPressFunctions={{ onPressX, onPressFlashlight, onPressSettings }}
          />
        )}
        <View style={Style.cameraBottomBarContainer}>
          <View style={Style.cameraBottomBarInnerContainer}>
            {/* Gallery Button */}
            <View style={Style.cameraGalleryButtonContainer}>
              <TransparentButton
                touchableOpacityProps={{
                  onPress: onPressGallery,
                }}
              >
                <GalleryIcon style={iconStyle} width={iconSize} height={iconSize} />
              </TransparentButton>
            </View>
            {/* Record Button */}
            <TransparentButton
              touchableOpacityProps={{
                disabled: !isPermissionGranted || isImageDisplayOn,
                onPress: onPressCapture,
              }}
              buttonStyle={{
                ...Style.cameraCaptureButton,
                opacity: isPermissionGranted ? 1 : 0.6 /* TODO: Think a better way to handle this situation */,
                backgroundColor: isImageDisplayOn ? "transparent" : Style.cameraCaptureButton.backgroundColor,
              }}
            ></TransparentButton>
            {/* Send Button */}
            <View style={{ alignSelf: "center", top: 50, right: 20.5 }}>
              <TransparentButton
                touchableOpacityProps={{
                  disabled: !currentImage,
                  onPress: onPressSend,
                }}
              >
                <SendIcon style={currentImage && iconStyle} width={iconSize} height={iconSize} />
              </TransparentButton>
            </View>
          </View>
        </View>
      </Camera>
    </View>
  );
}
