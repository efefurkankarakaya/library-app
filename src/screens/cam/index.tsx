import { useRef, type ReactNode } from "react";
import { Dimensions, Text, TouchableWithoutFeedbackProps, View } from "react-native";
import { Camera, CameraType } from "expo-camera";
import Style from "./index.style";
import { TextColor } from "../../common/colorPalette";
import { logWithTime } from "../../utils/utils";
import { CustomButton, CustomText } from "../../components";

interface InformationTextProps {
  children: ReactNode;
}

interface CameraCloseButtonProps {
  onPress: TouchableWithoutFeedbackProps["onPress"];
}

interface CamScreen {
  navigation: any; // TODO: Update the type according to the next navigation group
}

/* Local Components */
const InformationText = ({ children }: InformationTextProps) => <CustomText customTextStyle={Style.informationText}>{children}</CustomText>;

// TODO: Refactor style/css here.
const CameraCloseButton = ({ onPress }: CameraCloseButtonProps) => {
  return (
    <View
      style={{
        /* https://stackoverflow.com/questions/36938742/touchablehighlight-not-clickable-if-position-absolute */
        zIndex: 1 /* To be able to click on the button which is absolute positioned by its container. */,
        position: "absolute",
        marginTop: 50,
      }}
    >
      <CustomButton
        customButtonStyle={{
          backgroundColor: "transparent",
        }}
        customTextStyle={{
          color: TextColor.iOSGrey /* It seems fine in Android too */,
          fontSize: 20,
        }}
        touchableOpacityProps={{ onPress: onPress }}
      >
        X
      </CustomButton>
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
      const { uri } = await cameraRef.current.takePictureAsync();
      console.log(uri);
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
      <CustomButton
        touchableOpacityProps={{
          onPress: onPressCapture,
        }}
        customButtonStyle={{
          marginTop: 100,
        }}
      >
        Shoot
      </CustomButton>
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
