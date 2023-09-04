# Library App

A library application built on React Native and Realm.

## Technologies

- <a href="https://reactnative.dev/">React Native</a> (v0.71.8)
- <a href="https://react.dev/">React</a> (v18.2.0)
- <a href="https://www.mongodb.com/docs/realm/sdk/react-native/">Realm</a> (v11.10.1)
- <a href="https://www.typescriptlang.org/">Typescript</a> (v4.9.4)
- <a href="https://expo.dev/">Expo CLI</a> (v48.0.18)
- <a href="https://redux-toolkit.js.org/">Redux Toolkit</a> (v1.9.5)
- <a href="https://github.com/software-mansion/react-native-gesture-handler">React Native Gesture Handler</a> (v2.9.0)
- <a href="https://github.com/software-mansion/react-native-screens">React Native Screens</a> (v3.20.0)
- <a href="https://github.com/software-mansion/react-native-svg">React Native SVG</a> (v13.4.0)
- <a href="https://www.npmjs.com/package/moment-timezone">Moment Timezone</a> (v0.5.43)
- <a href="https://jestjs.io/">Jest</a> (v29.2.1)

## Dependencies

- <a href="https://nodejs.org/en">Node.js 18.16.0 LTS</a>
- <a href="https://brew.sh/">Brew</a> (to install pods and watchman)
- <a href="https://www.ruby-lang.org/en/">Ruby</a> (optional, for pods)
- <a href="https://developer.android.com/studio">Android Studio</a> (to install SDKs and emulator)
- <a href="https://developer.apple.com/xcode/">Xcode</a> (to build iOS)
- <a href="https://www.oracle.com/tr/java/technologies/javase/jdk11-archive-downloads.html">Java Development Kit (JDK) 11</a>

## How To Run?

### On Emulator

- Run `$ npm install` to install dependencies.
- Then `$ npm run {ios | android}` to run application on specified platform.

### On Real Device

- Run `$ npm install` to install dependencies.
- Connect mobile device via `USB` and make sure `USB Debugging` is allowed on your phone.
- Then `$ npm run {ios | android} --localhost`

## Possible Problems and Solutions

### $ npm run android → android/gradlew exited with non-zero code: 1

Probably, you have a different version of JDK than expected. According to the <a href="https://reactnative.dev/docs/environment-setup?guide=native&platform=android">documentation</a>, the most compatible and suggested version is JDK11.

You can find the JDK11 installer by clicking <a href="https://www.oracle.com/tr/java/technologies/javase/jdk11-archive-downloads.html">here</a>.

### $ npm run android → Build failed: SDK location not found.

- Create a file named `local.properties` under `android/` folder in project.
- Set inside `sdk.dir = {YOUR_SDK_PATH}`
- Then run `$ npm run android`
