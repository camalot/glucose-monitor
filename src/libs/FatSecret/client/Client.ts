import BaseClient, { IOptions } from "./BaseClient";
import { getAutocompleteFactory } from "./handlers/getAutocomplete";
import { getFoodFactory } from "./handlers/getFood";
import { getFoodFromBarcodeFactory } from "./handlers/getFoodFromBarcode";
import { getFoodSearchV1Factory } from "./handlers/getFoodSearchV1";
import { getFoodSearchV2Factory } from "./handlers/getFoodSearchV2";
import { getFoodSearchV3Factory } from "./handlers/getFoodSearchV3";
import { getAutocompleteV2Factory } from "./handlers/getAutocompleteV2";

export class Client extends BaseClient {
  constructor(options: IOptions) {
    super(options);
  }

  // handlers
  public getFood = getFoodFactory(this);
  public getFoodFromBarcode = getFoodFromBarcodeFactory(this);
  public getAutocomplete = getAutocompleteFactory(this);
  public getAutocompleteV2 = getAutocompleteV2Factory(this);
  public getFoodSearchV3 = getFoodSearchV3Factory(this);
  public getFoodSearchV1 = getFoodSearchV1Factory(this);
  public getFoodSearchV2 = getFoodSearchV2Factory(this);
}