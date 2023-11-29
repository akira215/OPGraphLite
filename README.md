# OPGraphLite

Graphical editor to edit Open Posit Hardware configuration .

## Project setup
```
npm install electron --save-dev
npm install --save-dev @electron-forge/cli
npx electron-forge import

npm install
```

### Compiles and hot-reloads for development
```
npm run electron:serve
```

### Compiles and minifies for production
```
npm run make
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
```
//vue.config.js
module.exports = {
	pluginOptions: {
		electronBuilder: {
			nodeIntegration: true,
			builderOptions: {
				productName: 'Cost App',
				publish: [
					{
						provider: "github",
						private: true,
						owner: "akira215",
						repo: "vuebudget",
						token: "......."
					}
				],
				win: {
					icon: 'build/icons/icon.png',
				},
				nsis: {
					installerIcon: 'build/installerIcon.ico',
					uninstallerIcon: 'build/installerIcon.ico',
					displayLanguageSelector: false,
					oneClick: false,
					perMachine: false,
					allowElevation: true,
					allowToChangeInstallationDirectory: true
				},
			},
		}
	}
}
```

### Publish Release 
Set GH_TOKEN env variable
```
$Env:GH_TOKEN = "...github token..."
```
Publish the release to Github
```
npm run electron:build -- -p always
```

Open repo in GitHub, and click on the releases tab. Publish the draft of this release so users can update to it.

