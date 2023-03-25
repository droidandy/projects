import {Selector, t} from 'testcafe';

export default class Runner {
    constructor () {
        this.getElementsByTagNameSelector 	= Selector(tag => document.getElementsByTagName(tag));
    }

 	
 	runUntil(startPage, endPage){

        let location = t.eval(() => window.location);
 		let currentPage = location.pathname;
 		while(currentPage != endPage){

 		}
 	}
}
