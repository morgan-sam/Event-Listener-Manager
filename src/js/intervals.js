class IntervalObj {
    constructor(intervalID, type, active) {
        this.intervalID = intervalID;
        this.type = type;
        this.active = active;
    }
}

let intervalStorage = [];

export const createInterval = (funcToPass, typeOfInterval, tickTime) => {
    const foundInt = intervalStorage.some(
        el => el.active === true && el.type === typeOfInterval,
    );
    foundInt
        ? null
        : intervalStorage.push(
              new IntervalObj(
                  setInterval(funcToPass, tickTime),
                  typeOfInterval,
                  true,
              ),
          );
};

export const clearIntervals = typeOfInterval => {
    for (var i = 0; i < intervalStorage.length; i++) {
        if (intervalStorage[i].type == typeOfInterval) {
            clearInterval(intervalStorage[i].intervalID);
            intervalStorage[i].active = false;
        }
    }
};
