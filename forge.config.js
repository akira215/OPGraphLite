module.exports = {
  packagerConfig: {
    asar: true,
    icon: 'app/img/OPicon', // no file extension required
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        // An URL to an ICO file to use as the application icon (displayed in Control Panel > Programs and Features).
        //iconUrl: 'app/img/OPicon.ico',
        // The ICO file to use as the icon for the generated Setup.exe
        setupIcon: 'app/img/OPicon.ico'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          // Linux icon
          icon: 'app/img/OPicon.png'
        }
      },
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        // Mac OS icon
        icon: 'app/img/OPicon.icns'
      }
    },
    {
      name: '@electron-forge/maker-wix',
      config: {
        icon: 'app/img/OPicon.ico'
      }
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        // Linux icon
        icon: 'app/img/OPicon.png'
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
