import base64
from flask import Flask, render_template, request
from turbo_flask import Turbo
import threading
import time
from keras.preprocessing.image import ImageDataGenerator
import tensorflow as tf
import numpy as np
from PIL import Image

model = tf.keras.models.load_model('Models/HDER_92_ACC.h5')

app = Flask(__name__)
turbo = Turbo(app)

@app.context_processor
def inject_load():
    load = finds()
    print("Prediction is:", load)
    return { 'prediction': load } 

def finds():
    test_datagen = ImageDataGenerator(rescale = 1./255)
    vals = ['Angry-Face', 'Awkward-Face', 'UpsideDown-Face', 'Frowning-Face', 'Heart-Eyes-Face', 'No-Mouth-Face', 'Sleeping-Face', 'Happy-Face', 'X-Face'] # change this according to what you've trained your model to do
    test_dir = 'Images'
    test_generator = test_datagen.flow_from_directory(
            test_dir,
            target_size = (150, 150),
            color_mode = "grayscale",
            shuffle = False,
            class_mode = 'categorical',
            batch_size = 1
            )
            
    pred = model.predict(test_generator)
    print(pred)
    #print("Prediction: ", str(vals[np.argmax(pred)]))
    #print(np.argsort(pred))
    return str(vals[np.argmax(pred)])

def getImage(data):
    if data == None:
        return False
    else:
        output = data
        #print(type(output))
        image = base64.decodestring(output)
        imageresult = open('Images/toPredict/user.png', 'wb')
        imageresult.write(image)

        
# ===============================================

@app.route("/")
def home():
    return render_template('index.html')

@app.route("/draw", methods=['GET', 'POST'])
def draw():
    data = None

    if request.method == 'POST':
        data = request.get_data()
        getImage(data)

    return render_template('draw.html')

# ===============================================

@app.before_first_request
def before_first_request():
    threading.Thread(target=update_load).start()

def update_load():
    with app.app_context():
        while True:
            time.sleep(1)
            turbo.push(turbo.replace(render_template('loadPred.html'), 'load'))