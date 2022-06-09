import sys
import numpy as np
from math import ceil, pow
import cv2
import array
import os
import scipy.misc
import imageio
from matplotlib import pyplot as plt
from matplotlib.pyplot import cm
from os import walk

#check argv
if len(sys.argv) == 2:
    num_fol = int(sys.argv[1], 10)
else:
    print("Usage: python scale-gray-image.py X")
    print("X: number of folders created after module collection step.")
    sys.exit()

directory = "./wasm/"
for i in range(num_fol):
    mypath = directory + str(i) + "/"
    filenames = next(walk(mypath), (None, None, []))[2]  # [] if no file 
    for j in range(len(filenames)):
        path = mypath + filenames[j]
        with open(path,'rb') as binary_file:        
            data = binary_file.read()
        ln = len(data)
        
        # a is vector of 8-bit unsigned integers (uint8)S
        # a = np.frombuffer(data, dtype=np.uint8)

        width = int(ceil(pow(ln,0.5)))
        if width ==0: 
            print(ln)
            print("[!] ", path," have width = 0 => cannot scale")
        else:
            rem = int(ceil(ln%width))
            a   = array.array("B")
            f = open(path,'rb')
            a.fromfile(f,ln-rem)
            f.close
            # pad_len = ln - rem

            # padded_a = np.hstack((a, np.zeros(pad_len, np.uint8)))

            g = np.reshape(a, (len(a)//width, width))
            # print(type(g))
            name = mypath + "_BEFORE.png"
            cv2.imwrite(name, g)

            g = np.uint8(g)
            h = np.resize(g,(100,100))
            # print(h)
            h = h/255
            h = h.reshape(-1,100,100,1)
            # print(type(h))
            # print(h)
            #imageio.imwrite("img.jpg", h)
            for k in range(len(h)):
                plt.imsave(path + '.jpg', h[k,:,:,0],format="png", cmap=cm.gray)

