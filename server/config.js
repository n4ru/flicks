flicks = {
  "Flick1": {
    "cmd":"Rundll32.exe User32.dll,LockWorkStation"
  },
  "Flick2": {
    "cmd":"powershell.exe \"Get-WmiObject -Class Win32_OperatingSystem -ComputerName . | % {$_.Lockout = $false;$_.put()}\""
  }
}