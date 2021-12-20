from pathlib import Path
from tkinter import *
from PIL import Image, ImageTk


OUTPUT_PATH = Path(__file__).parent
ASSETS_PATH = OUTPUT_PATH / Path('./assets')


def relative_to_assets(path: str) -> Path:
    return ASSETS_PATH / Path(path)

activeWindow = {
    'mpActive' : True,
    'planActive' : False,
    'recomActive' : False,
    'friendActive' : False
}

#Button events
def resetButtons():
    canvas.itemconfig(mpButton, image=mpImage)
    canvas.itemconfig(planningButton, image=planningImage)
    canvas.itemconfig(recomButton, image=recomImage)
    canvas.itemconfig(friendsButton, image=friendsImage)
    activeWindow['mpActive'] = False
    activeWindow['planActive'] = False
    activeWindow['recomActive'] = False
    activeWindow['friendActive'] = False


def mostPlayed(event):
    resetButtons()
    activeWindow['mpActive'] = True
    canvas.itemconfig(mpButton, image=mpSelected)

def planning(event):
    resetButtons()
    activeWindow['planActive'] = True
    canvas.itemconfig(planningButton, image=planningSelected)

def recommended(event):
    resetButtons()
    activeWindow['recomActive'] = True
    canvas.itemconfig(recomButton, image=recomSelected)

def friends(event):
    resetButtons()
    activeWindow['friendActive'] = True
    canvas.itemconfig(friendsButton, image=friendSelected)


def mpHoverEnter(event):
    if activeWindow['mpActive']:
        return
    else:
        canvas.itemconfig(mpButton, image=mpHover)

def mpHoverLeave(event):
    if activeWindow['mpActive']:
        return
    else:
        canvas.itemconfig(mpButton, image=mpImage)

def planHoverEnter(event):
    if activeWindow['planActive']:
        return
    else:
        canvas.itemconfig(planningButton, image=planningHover)

def planHoverLeave(event):
    if activeWindow['planActive']:
        return
    else:
        canvas.itemconfig(planningButton, image=planningImage)

def recomHoverEnter(event):
    if activeWindow['recomActive']:
        return
    else:
        canvas.itemconfig(recomButton, image=recomHover)

def recomHoverLeave(event):
    if activeWindow['recomActive']:
        return
    else:
        canvas.itemconfig(recomButton, image=recomImage)

def friendHoverEnter(event):
    if activeWindow['friendActive']:
        return
    else:
        canvas.itemconfig(friendsButton, image=friendHover)

def friendHoverLeave(event):
    if activeWindow['friendActive']:
        return
    else:
        canvas.itemconfig(friendsButton, image=friendsImage)

#Create Window
window = Tk()

window.geometry("1366x768")
window.configure(bg="#FFFFFF")

#Button vars
mpSelected = ImageTk.PhotoImage(Image.open(relative_to_assets('mpSelected.png')))
mpHover = ImageTk.PhotoImage(Image.open(relative_to_assets('mpHover.png')))
mpImage = ImageTk.PhotoImage(Image.open(relative_to_assets('MOST PLAYED.png')))

planningSelected = ImageTk.PhotoImage(Image.open(relative_to_assets('planningSelected.png')))
planningHover = ImageTk.PhotoImage(Image.open(relative_to_assets('planningHover.png')))
planningImage = ImageTk.PhotoImage(Image.open(relative_to_assets('PLANNING.png')))

recomSelected = ImageTk.PhotoImage(Image.open(relative_to_assets('recomSelected.png')))
recomHover = ImageTk.PhotoImage(Image.open(relative_to_assets('recomHover.png')))
recomImage = ImageTk.PhotoImage(Image.open(relative_to_assets('RECOMMENDED.png')))

friendSelected = ImageTk.PhotoImage(Image.open(relative_to_assets('friendSelected.png')))
friendHover = ImageTk.PhotoImage(Image.open(relative_to_assets('friendHover.png')))
friendsImage = ImageTk.PhotoImage(Image.open(relative_to_assets('FRIENDS.png')))


#Create canvas
canvas = Canvas(
    window,
    bg='#FFFFFF',
    height=768,
    width=1366,
    bd=0,
    highlightthickness=0,
    relief='ridge'
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
canvas.tag_bind(mpButton, '<Enter>', mpHoverEnter)
canvas.tag_bind(mpButton, '<Leave>', mpHoverLeave)

#Planning button
planningButton = canvas.create_image(360, 65, image=planningImage, anchor=CENTER)
canvas.tag_bind(planningButton, '<Button-1>', planning)
canvas.tag_bind(planningButton, '<Enter>', planHoverEnter)
canvas.tag_bind(planningButton, '<Leave>', planHoverLeave)

#Recommended button
recomButton = canvas.create_image(600, 65, image=recomImage, anchor=CENTER)
canvas.tag_bind(recomButton, '<Button-1>', recommended)
canvas.tag_bind(recomButton, '<Enter>', recomHoverEnter)
canvas.tag_bind(recomButton, '<Leave>', recomHoverLeave)

#Friends button
friendsButton = canvas.create_image(825, 65, image=friendsImage, anchor=CENTER)
canvas.tag_bind(friendsButton, '<Button-1>', friends)
canvas.tag_bind(friendsButton, '<Enter>', friendHoverEnter)
canvas.tag_bind(friendsButton, '<Leave>', friendHoverLeave)

canvas.place(x=0, y=0)
window.resizable(False, False)
window.mainloop()
