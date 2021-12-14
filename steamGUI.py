from pathlib import Path
from tkinter import *
from PIL import Image, ImageTk


OUTPUT_PATH = Path(__file__).parent
ASSETS_PATH = OUTPUT_PATH / Path("./assets")


def relative_to_assets(path: str) -> Path:
    return ASSETS_PATH / Path(path)


#Button events
def resetButtons():
    canvas.itemconfig(mpButton, image=mpImage)
    canvas.itemconfig(planningButton, image=planningImage)
    canvas.itemconfig(recomButton, image=recomImage)
    canvas.itemconfig(friendsButton, image=friendsImage)

def mostPlayed(event):
    resetButtons()
    canvas.itemconfig(mpButton, image=mpSelected)

def planning(event):
    resetButtons()
    canvas.itemconfig(planningButton, image=planningSelected)

def recommended(event):
    resetButtons()
    canvas.itemconfig(recomButton, image=recomSelected)

def friends(event):
    resetButtons()
    canvas.itemconfig(friendsButton, image=friendSelected)

#Create Window
window = Tk()

window.geometry("1366x768")
window.configure(bg="#FFFFFF")

#Vars
mpSelected = ImageTk.PhotoImage(Image.open(relative_to_assets('mpSelected.png')))
mpImage = ImageTk.PhotoImage(Image.open(relative_to_assets('MOST PLAYED.png')))

planningSelected = ImageTk.PhotoImage(Image.open(relative_to_assets('planningSelected.png')))
planningImage = ImageTk.PhotoImage(Image.open(relative_to_assets('PLANNING.png')))

recomSelected = ImageTk.PhotoImage(Image.open(relative_to_assets('recomSelected.png')))
recomImage = ImageTk.PhotoImage(Image.open(relative_to_assets('RECOMMENDED.png')))

friendSelected = ImageTk.PhotoImage(Image.open(relative_to_assets('friendSelected.png')))
friendsImage = ImageTk.PhotoImage(Image.open(relative_to_assets('FRIENDS.png')))


#Create canvas
canvas = Canvas(
    window,
    bg="#FFFFFF",
    height=768,
    width=1366,
    bd=0,
    highlightthickness=0,
    relief="ridge"
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
mpButton = canvas.create_image(135, 65, image=mpSelected, anchor=CENTER)
canvas.tag_bind(mpButton, '<Button-1>', mostPlayed)

#Planning button
planningButton = canvas.create_image(360, 65, image=planningImage, anchor=CENTER)
canvas.tag_bind(planningButton, '<Button-1>', planning)

#Recommended button
recomButton = canvas.create_image(600, 65, image=recomImage, anchor=CENTER)
canvas.tag_bind(recomButton, '<Button-1>', recommended)

#Friends button
friendsButton = canvas.create_image(825, 65, image=friendsImage, anchor=CENTER)
canvas.tag_bind(friendsButton, '<Button-1>', friends)


canvas.place(x=0, y=0)
window.resizable(False, False)
window.mainloop()
