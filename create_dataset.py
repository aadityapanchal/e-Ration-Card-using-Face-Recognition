# USAGE
# python build_face_dataset.py --name jayesh

# import the necessary packages
from imutils.video import VideoStream
import argparse
import imutils
import time
import cv2
import os

# construct the argument parser and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-n", "--name", required=True,
	help = "path to where the face cascade resides")
args = vars(ap.parse_args())

# initialize the video stream, allow the camera sensor to warm up,
# and initialize the total number of example faces written to disk
# thus far
print("[INFO] starting video stream...")
vs = VideoStream(src=0).start()

time.sleep(2.0)
total = 0

file_path = "./dataset/" + args["name"]
# print(file_path)
if not os.path.exists(file_path):
	os.makedirs(file_path)
start = time.time()
end=0

# # loop over the frames from the video stream
while True:
	# grab the frame from the threaded video stream, clone it, (just
	# in case we want to write it to disk), and then resize the frame
	# so we can apply face detection faster

	frame = vs.read()
	orig = frame.copy()
	# frame = imutils.resize(frame, width=400)

	# show the output frame
	# cv2.imshow("Frame", frame)
	key = cv2.waitKey(1) & 0xFF

	if ((total % 10) == 0):
		p = os.path.sep.join([file_path, "{}.png".format(str(total).zfill(5))])
		# print(p)
		cv2.imwrite(p, orig)
	total += 1

	timer = time.time() - start
	if (timer >= 30):
		break


	# if the `q` key was pressed, break from the loop
	if key == ord("q"):
		break

	
# print(time.time() - start)
# do a bit of cleanup
print("[INFO] {} face images stored".format(int(total / 5)))
print("[INFO] cleaning up...")
cv2.destroyAllWindows()
vs.stop()
