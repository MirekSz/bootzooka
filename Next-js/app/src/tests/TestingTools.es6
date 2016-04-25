/**
 * Created by Mirek on 2015-06-30.
 */
export function wait(call, done, time = 500) {
    setTimeout(function () {
        try {
            call();
            done();
        } catch (e) {
            done(e);
        }
    }, time);
}


export function asyncWait(time = 500) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    });
}

export function mochaAsync(fn) {
    return async (done) => {
        try {
            await fn();
            done();
        } catch (err) {
            done(err);
        }
    };
};

export function ita(description, fn) {
    it(description, mochaAsync(fn));
};