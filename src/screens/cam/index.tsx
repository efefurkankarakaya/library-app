import { Text, View } from "react-native";
import { Camera, CameraType } from "expo-camera";
import CustomButton from "../../components/CustomButton";
import Style from "./index.style";
import { TextColor } from "../../common/colorPalette";

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
export default function CamScreen({ navigation }) {
  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission) {
    requestPermission();
  }

  const onPress = () => {
    navigation.goBack();
  };

  return (
    <View style={Style.container}>
      <Camera type={CameraType.back}>
        <CustomButton
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
        </CustomButton>
      </Camera>
      <Text>Camera</Text>
    </View>
  );
}
