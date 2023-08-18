import base64
import platform
import subprocess

def imageToBase64(imagePath: str) -> bytes:
    with open(imagePath, "rb") as imageFile:
        base64Encoded = base64.b64encode(imageFile.read())
        return base64Encoded

def convertBytesToString(data: bytes) -> str:
    decoded: str = data.decode(encoding="utf-8")
    string: str = str(decoded)
    return string

def copyToClipboard(text):
    operatingSystem = platform.system().lower()
    
    command = ""
    prefix = 'echo ' + text.strip()

    if operatingSystem == 'darwin':
        command = prefix + '|pbcopy'
    # elif operatingSystem == 'linux' or operatingSystem == 'windows':
    # TODO: Has not been tried yet.
    # https://stackoverflow.com/questions/11063458/python-script-to-copy-text-to-clipboard
    #     command = prefix + '|clip'

    return subprocess.check_call(command, shell=True)

while (imagePath := input("Enter a path: ")).strip() == "":
    pass

# https://base64.guru/converter/decode/image
try:
    encoded = imageToBase64(imagePath)
    converted = convertBytesToString(encoded)
    copyToClipboard(converted)
    # print(converted)
    print("Done.")
except Exception as error:
    print(error)