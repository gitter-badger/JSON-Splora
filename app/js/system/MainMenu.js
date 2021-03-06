'use strict'

/**
 * Dependencies
 */

const fs = require('fs')

const { remote } = require('electron')

const { Menu, BrowserWindow, dialog } = remote

class MainMenu {

  /**
   * Create the main menu for the given app
   */

  constructor(app, settings) {
    this.app = app
    this.settings = settings
    const template = this.createTemplate()

    // Finally, build menu
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  }

  /**
   *  Callback for when theme button is clicked.
   */

  themeClicked(menuItem) {
    this.settings.set('theme', menuItem.theme)
    this.app.setTheme(menuItem.theme)
  }

  createTemplate() {
    const template = [{
      label: 'File',
      submenu: [{
        label: 'Open JSON file...',
        accelerator: 'CommandOrControl+O',
        click: () => {
          dialog.showOpenDialog(
            BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0],
            { filters: [{ name: 'JSON Files', extensions: ['json'] }, { name: 'All Files', extensions: ['*'] }] },
            (filePaths) => {
              window.app = this.app
              this.app.getCurrentPage().editor.editor.setValue(fs.readFileSync(filePaths[0], 'utf8'))
            }
          )
        }
      }] }, {
        label: 'Edit',
        submenu: [{
          role: 'undo'
        }, {
          role: 'redo'
        }, {
          type: 'separator'
        }, {
          role: 'cut'
        }, {
          role: 'copy'
        }, {
          role: 'paste'
        }, {
          role: 'selectall'
        }, {
          type: 'separator'
        }, {
          label: 'Format',
          accelerator: 'CommandOrControl+Shift+F',
          click: () => {
            this.app.getCurrentPage().editor.format()
          }
        }, {
          label: 'Minify',
          accelerator: 'CommandOrControl+Shift+M',
          click: () => {
            this.app.getCurrentPage().editor.minify()
          }
        }]
      }, {
        label: 'View',
        submenu: [{
          role: 'reload'
        }, {
          role: 'toggledevtools'
        }, {
          type: 'separator'
        }, {
          role: 'resetzoom'
        }, {
          role: 'zoomin'
        }, {
          role: 'zoomout'
        }, {
          type: 'separator'
        }, {
          label: 'Theme',
          submenu: this.createThemeSubMenu()
        }, {
          type: 'separator'
        }, {
          role: 'togglefullscreen'
        }]
      }, {
        role: 'window',
        submenu: [{
          role: 'minimize'
        }, {
          role: 'close'
        }]
      }, {
        role: 'help',
        submenu: [{
          label: 'Learn More',
          click: () => {
            electron.shell.openExternal('http://electron.atom.io')
          }
        }]
      }]
    if (process.platform === 'darwin') {
      template.unshift({
        label: 'JSON-Splora',
        submenu: [{
          role: 'about'
        }, {
          type: 'separator'
        }, {
          role: 'services',
          submenu: []
        }, {
          type: 'separator'
        }, {
          role: 'hide'
        }, {
          role: 'hideothers'
        }, {
          role: 'unhide'
        }, {
          type: 'separator'
        }, {
          role: 'quit'
        }]
      })

      // Edit menu.
      template[2].submenu.push({
        type: 'separator'
      }, {
        label: 'Speech',
        submenu: [{
          role: 'startspeaking'
        }, {
          role: 'stopspeaking'
        }]
      })

      // Window menu.
      template[4].submenu = [{
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      }, {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      }, {
        label: 'Zoom',
        role: 'zoom'
      }, {
        type: 'separator'
      }, {
        label: 'Bring All to Front',
        role: 'front'
      }]
    }

    return template
  }

  /**
   * Create the theme sub menu. (Later versions can create this programmatically)
   */

  createThemeSubMenu() {
    const themes = [{
      label: 'Default',
      theme: 'default'
    }, {
      label: 'Elegant',
      theme: 'Elegant'
    }, {
      label: 'Mdn-Like',
      theme: 'mdn-like'
    }, {
      label: 'Neat',
      theme: 'neat'
    }, {
      label: 'Neo',
      theme: 'neo'
    }]

    // give properties
    const selectedTheme = this.settings.get('theme')
    themes.forEach((i) => {
      const t = i
      t.type = 'radio'
      t.checked = (selectedTheme === t.theme)
      t.click = (menuItem) => {
        this.themeClicked(menuItem)
      }
    })
    return themes
  }
}


/**
 * Export MainMenu
 */

module.exports = MainMenu
