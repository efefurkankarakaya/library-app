# Library App

A library application.

# Technologies

- React Native (0.71.8)
- React (18.2.0)

# Dependencies

- <a href="https://nodejs.org/en">Node.js 18.16.0 LTS</a>
- <a href="https://brew.sh/">Brew</a> (to install pods and watchman)
- <a href="https://www.ruby-lang.org/en/">Ruby</a> (optional, for pods)
- <a href="https://developer.android.com/studio">Android Studio</a> (to install SDKs and emulator)
- <a href="https://developer.apple.com/xcode/">Xcode</a> (to build iOS)
- <a href="https://www.oracle.com/tr/java/technologies/javase/jdk11-archive-downloads.html">Java Development Kit (JDK) 11</a>

# How To Run?

- Run `$ npm install` to install dependencies.
- Then `$ npm run {ios | android}` to run application on specified platform.

# Possible Problems and Solutions

## $ npm run android → android/gradlew exited with non-zero code: 1

Probably, you have a different version of JDK than expected. According to the <a href="https://reactnative.dev/docs/environment-setup?guide=native&platform=android">documentation</a>, the most compatible and suggested version is JDK11.

You can find the JDK11 installer by clicking <a href="https://www.oracle.com/tr/java/technologies/javase/jdk11-archive-downloads.html">here</a>.

## $ npm run android → Build failed: SDK location not found.

- Create a file named `local.properties` under `android/` folder in project.
- Set inside `sdk.dir = {YOUR_SDK_PATH}`
- Then run `$ npm run android`
