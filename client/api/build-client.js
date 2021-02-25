import axios from "axios";

const Named = ({req}) => {
    if (typeof window === 'undefined') {
        //we are on the server
        return axios.create({
            baseURL: 'http://www.tickatix-app-learn.xyz/',
            headers: req.headers
        });
    } else {
        //we must be on the browser
        return axios.create({
            baseURL: '/'
        });
    }
};

export default Named;