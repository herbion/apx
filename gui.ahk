#SingleInstance, Force
SendMode Input
SetWorkingDir, %A_ScriptDir%

global Debug

CreateGui() {
    global Debug
    Gui, Font, cGreen, Lucida Console
    Gui, Font, s12
    Gui, Font, s10
    Gui, Font, s8
    Gui, -AlwaysOnTop
    Gui, Color, Black
    Gui, Show, w450 h400, script

    Gui, Add, Edit, Readonly x10 y10 w400 h300 vDebug
    Gui, Show, w420 h320, Debug Window
}

GuiDebug(Data) {
    GuiControlGet, Debug
    GuiControl,, Debug, %Data%`r`n%Debug%
}

CreateGui()
