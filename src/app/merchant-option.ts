import { Merchant } from "./merchant";

export class MerchantOption {
  id: number;
  nameAndLastname: string;
  email: string;

  constructor(
    id: number,
    nameAndLastName: string,
    email: string,
    ) {
        this.id = id;
        this.nameAndLastname = nameAndLastName;
        this.email = email;
  }

  static toMerchantOption(merchants: Merchant[]): MerchantOption[]{
    let options : MerchantOption[] = [];
    let option: MerchantOption;
    let name : string[];
    merchants.forEach(merchant => {
      name = merchant.name.split(' ');
      option = new MerchantOption(merchant.idMerchant, name[0] + name[1], merchant.email);
      options.push(option);
    });
    return options;
  }
}
