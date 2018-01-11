import {Injectable, Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'filter'
})

@Injectable()
export class FilterPipe implements PipeTransform {
    transform(items: any[], field: string, value: string): any[] {

        console.log('field: ', field);
        console.log('value: ', value);

        if (!items) return [];

        if (!value || value.length == 0) return items;

        return items.filter(
            (it) => {

                const item = it[field];

                if(isNaN(item)){
                    return item.toLowerCase().indexOf(value.toLowerCase()) != -1
                }

                return item == value;

            }
        );
    }
}