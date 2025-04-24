class IdKeyValue {
  id: number;
  name: string;
  /*
    @value:  Valid values are 1 (True), 0 (False) and -1 (Unknown). Eg. Soy: 1 (Contains soy), 0 (Does not contain soy), -1 (Unknown)
  */
  value?: boolean;
  
  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.value = data.value !== undefined || data.value === -1 
      ? undefined 
      : (
          data.value === 1 ? true : false
        );
  }
}

export default IdKeyValue;