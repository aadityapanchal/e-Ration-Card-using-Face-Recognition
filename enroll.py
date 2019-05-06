enroll = []
    temp = {}
    with open('enrollment.json') as f:
        data = json.load(f)
        for name in face_names:
            temp["Name"] = name
            temp["Enrollment"] = data[name]
            enroll.append(temp)
            temp = {}

        payLoad = dict()
        payLoad["data"] = enroll
        r = requests.post('http://192.168.1.106:3000/upload',
                          json=payLoad)
        print(enroll)