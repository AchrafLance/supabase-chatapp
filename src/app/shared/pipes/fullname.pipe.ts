import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
    name: 'fullnameFormat'
})
export class FullnamePipe implements PipeTransform{
    public transform(fullname: string){
        return _.startCase(_.toLower(fullname));
    }

}
