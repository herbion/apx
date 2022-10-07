#NoEnv
#KeyHistory, 0
#SingleInstance force
#MaxThreadsBuffer on
#Persistent
#MaxHotkeysPerInterval 99000000
#HotkeyInterval 99000000
#KeyHistory 0

SetBatchLines, -1
ListLines, Off
SetWorkingDir %A_ScriptDir%
SetKeyDelay, -1, -1
SetMouseDelay, -1
SetDefaultMouseSpeed, 0
SetWinDelay, -1

#Include %A_ScriptDir%\gui.ahk
#Include %A_ScriptDir%\voice.ahk

; cfg
sens := 1.2 ; in game sens
modifier := 3.4 / sens

; variables
global weapons := {}
global patterns := {}

global slots := { 1: "", 2: "", none: ""}
global slot := 1

; startup
IniRead, settings, settings.ini, keymap	
weapons := Object(StrSplit(settings, ["=", "`n"])*)

; bindings
for hot_key, weapon in weapons {
    patterns[weapon] := load_pattern("patterns/" . weapon . ".txt")
    Hotkey, ~$*%hot_key%, swap_weapon
}
Hotkey, ~$*1, swap_slot
Hotkey, ~$*2, swap_slot
HotKey, ~$*g, noop
HotKey, ~$*3, noop
Hotkey, ~$*5, reset
F12::reload
~end::
    speak("bye")
    Exitapp
return

; labels
swap_weapon:
    hot_key := StrReplace(A_ThisHotkey, "~$*", "")
    slots[slot] := weapons[hot_key]
    voice.speak(slots[slot], 1)
return

swap_slot:
    slot := StrReplace(A_ThisHotkey, "~$*", "")
return

noop:
    slot := "none"
return

reset:
    slots := { 1: "", 2: ""}
    slot := 1
    speak("reset")
return

load_pattern(fileName) {
    FileRead, pattern, %fileName%
    pattern := StrSplit(pattern, "`n")
    return pattern
}

~$*LButton::
    if (A_cursor != "Unknown")
        return
    GuiDebug("--------")
    StartTime := A_TickCount
    sleep 5
    loop {
        active_pattern := patterns[slots[slot]]
        pattern := strsplit(active_pattern[a_index], ",")

        x := pattern[1]
        y := pattern[2]
        t := pattern[3]

        ElapsedTime := A_TickCount - StartTime
        GuiDebug(active_pattern . "-" . a_index . "[" . x . ":" . y . "]" . " --- " . ElapsedTime)
        dllcall("mouse_event", "UInt", 0x01, "UInt", x*modifier, "UInt", y*modifier)
        sleep t
    } until !GetKeyState("LButton","P") || a_index > active_pattern.maxindex()
return
