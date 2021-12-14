from pathlib import Path
from tkinter import *
from PIL import Image, ImageTk


OUTPUT_PATH = Path(__file__).parent
ASSETS_PATH = OUTPUT_PATH / Path("./assets")


def relative_to_assets(path: str) -> Path:
    return ASSETS_PATH / Path(path)

def mostPlayed(event):
    print('button pressed')

window = Tk()

window.geometry("1366x768")
window.configure(bg = "#FFFFFF")

#Creates canvas
canvas = Canvas(
    window,
    bg = "#FFFFFF",
    height = 768,
    width = 1366,
    bd = 0,
    highlightthickness = 0,
    relief = "ridge"
)

#Background Image
entryBackground = PhotoImage(
    file=relative_to_assets('backgroundImage.png'))
entry_bg_1 = canvas.create_image(
    683,
    384,
    image=entryBackground
)

#Most played button
mpImage = ImageTk.PhotoImage(Image.open(relative_to_assets('MOST PLAYED.png')))
mpButton = canvas.create_image(30, 50, image=mpImage, anchor=NW)
canvas.tag_bind(mpButton, '<Button-1>', mostPlayed)

#Planning button
planningImage = ImageTk.PhotoImage(Image.open(relative_to_assets('PLANNING.png')))
planningButton = canvas.create_image(285, 50, image=planningImage, anchor=NW)
canvas.tag_bind(planningButton, '<Button-1>', mostPlayed)

#Recommended button
recomImage = ImageTk.PhotoImage(Image.open(relative_to_assets('RECOMMENDED.png')))
recomButton = canvas.create_image(485, 50, image=recomImage, anchor=NW)
canvas.tag_bind(recomButton, '<Button-1>', mostPlayed)

#Friends button
friendsImage = ImageTk.PhotoImage(Image.open(relative_to_assets('FRIENDS.png')))
friendsButton = canvas.create_image(775, 50, image=friendsImage, anchor=NW)
canvas.tag_bind(friendsButton, '<Button-1>', mostPlayed)


canvas.place(x = 0, y = 0)
window.resizable(False, False)
window.mainloop()
