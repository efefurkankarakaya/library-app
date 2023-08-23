import { useRef, type ReactNode } from "react";
import { Dimensions, Image, Text, TouchableWithoutFeedbackProps, View } from "react-native";
import { Camera, CameraType } from "expo-camera";
import Style from "./index.style";
import { TextColor } from "../../common/colorPalette";
import { logWithTime } from "../../utils/utils";
import { CustomButton, CustomText } from "../../components";
import FlashLightOn from "../../../assets/flash_on.svg";
import X from "../../../assets/x.svg";
import Settings from "../../../assets/settings.svg";

// https://github.com/expo/examples
// https://github.com/expo/examples/blob/master/with-camera/App.js

interface InformationTextProps {
  children: ReactNode;
}

interface CameraCloseButtonProps {
  onPress: TouchableWithoutFeedbackProps["onPress"];
}

interface CamScreen {
  navigation: any; // TODO: Update the type according to the next navigation group
}

const iconSize = Dimensions.get("window").width * 0.09;

/* Local Components */
const InformationText = ({ children }: InformationTextProps) => <CustomText customTextStyle={Style.informationText}>{children}</CustomText>;

// TODO: Refactor style/css here.
const CameraCloseButton = ({ onPress }: CameraCloseButtonProps) => {
  // TODO: Refactor here
  return (
    <View
      style={{
        /* https://stackoverflow.com/questions/36938742/touchablehighlight-not-clickable-if-position-absolute */
        zIndex: 1 /* To be able to click on the button which is absolute positioned by its container. */,
        position: "absolute",
        marginTop: 50,
        width: "100%",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {/* TODO: Make this component generi container */}
        <CustomButton
          customButtonStyle={{
            backgroundColor: "transparent",
            padding: 2,
            margin: 0,
          }}
          touchableOpacityProps={{ onPress: onPress }}
        >
          <X
            width={iconSize}
            height={iconSize}
            style={{
              fill: "lightgray" /* TODO: Find a common camera subcomponent color*/,
            }}
          />
        </CustomButton>
        <CustomButton
          customButtonStyle={{
            margin: 0,
            padding: 2,
            backgroundColor: "transparent",
          }}
          // touchableOpacityProps={{ onPress: onPress }}
        >
          <FlashLightOn
            width={iconSize}
            height={iconSize}
            style={{
              fill: "lightgray",
            }}
          />
        </CustomButton>
        <CustomButton
          customButtonStyle={{
            margin: 0,
            padding: 2,
            paddingRight: 4,
            backgroundColor: "transparent",
          }}
          // touchableOpacityProps={{ onPress: onPress }}
        >
          <Settings
            width={iconSize}
            height={iconSize}
            style={{
              fill: "lightgray",
            }}
          />
        </CustomButton>
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
        <CameraCloseButton onPress={onPressX} />
        <View style={Style.permissionContainer}>
          <InformationText>Could not access to camera.</InformationText>
          <View style={Style.row}>
            <InformationText>Click</InformationText>
            <InformationText> </InformationText>
            <CustomButton
              touchableOpacityProps={{ onPress: requestPermission }}
              customButtonStyle={Style.grantPermissionButton}
              customTextStyle={Style.grantPermissionText}
            >
              here
            </CustomButton>
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
      <CameraCloseButton onPress={onPressX} />
      <View
        style={{
          position: "absolute",
          bottom: 70,
          width: "100%",
        }}
      >
        <View
          style={{
            alignItems: "center",
          }}
        >
          <CustomButton
            touchableOpacityProps={{
              onPress: onPressCapture,
            }}
            customButtonStyle={{
              backgroundColor: "lightgray", // TODO: Find a better grey
              height: 65,
              width: 65,
              borderRadius: 100,
            }}
          ></CustomButton>
          <CustomButton
            customButtonStyle={{
              backgroundColor: "transparent",
            }}
          ></CustomButton>
        </View>
      </View>
      <Camera type={CameraType.back} ref={cameraRef}>
        {/* <CustomButton
          customButtonStyle={{
            marginTop: 50,
            backgroundColor: "black",
          }}
          customTextStyle={{
            color: TextColor.iOSGrey,
            fontSize: 20,
          }}
          touchableOpacityProps={{ onPress: onPress }}
        >
          X
        </CustomButton> */}
      </Camera>
    </View>
  );
}
