# floorplanner-cost-estimate
machine learning + image manipulation + using **YOLOV8** object detection model

## software requirements
- label-studio (to make annotations)
- ultralytics 8.0.198
- pytorch 2.3.1
- cuda 12.1
- YOLOV8 (ai model)

## technical requirements
- storage to be over 50GB and a good processor
- having a gpu to use CUDA 12.1 will reduce training time

# setup environment
- make sure to have python 3.11 
- use yay to install from aur (for linux)

## installation
create environment inside training_model - as this is the file where the working model and jupyter notebook works

```bash
python3.11 -m venv .venv
```
activate the environment, this is where we will work from now on

```bash
source .venv/bin/activate #linux
```
```bash
.venv\Scripts\Activate.ps1 #windows
```
install the environment.txt file (this has the required libraries)

```bash
pip install -r environment.txt --extra-index-url https://download.pytorch.org/whl/cu121
```

set the python environment kernal for jupyter

```bash
pip install ipykernel notebook jupyter
```
```bash
python -m ipykernel install --user --name floorplanner-kernel --display-name "floor-planner-kernal"
```
## model setup

in Jupyter notebook, set the kernal to **floor-planner-kernal** and run each cell one by one for clear understanding 
- usually the only errors you'll encounter is "paths"
- also make sure to change the path in dataset.yaml file
