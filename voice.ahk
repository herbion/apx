#SingleInstance, Force
SendMode Input
SetWorkingDir, %A_ScriptDir%

global voice := ComObjCreate("SAPI.SpVoice")

voice.Rate := 5
voice.Volume := 70

speak(message) {
    voice.speak(message, 1)
}