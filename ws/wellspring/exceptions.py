class DeviceNotRegistered(Exception):
    def __init__(self, message):
        super(DeviceNotRegistered, self).__init__(message)