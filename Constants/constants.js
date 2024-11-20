export default class Constants {
    // 单列市
    static SPECIAL_CITY = ["3302", "3502", "4403", "3702", "2102", "1314"];
    // 直辖市
    static MUNICIPALITY = ["11", "31", "12", "50"];

    #COMPANY_KEY_VALUE_LIST_MAP = {
        "0000":{"CODEVALUE":"0000","CODENAME": "全国"},
        "1100":{"CODEVALUE":"1100","CODENAME": "北京"},
        "3200":{"CODEVALUE":"3200","CODENAME": "江苏"},
        "1200":{"CODEVALUE":"1200","CODENAME":"天津"},
        "1300":{"CODEVALUE":"1300","CODENAME":"河北"},
        "1314":{"CODEVALUE":"1314","CODENAME":"雄安"},
        "1400":{"CODEVALUE":"1400","CODENAME":"山西"},
        "1500":{"CODEVALUE":"1500","CODENAME":"内蒙古"},
        "2100":{"CODEVALUE":"2100","CODENAME":"辽宁"},
        "2102":{"CODEVALUE":"2102","CODENAME":"大连"},
        "2200":{"CODEVALUE":"2200","CODENAME":"吉林"},
        "2300":{"CODEVALUE":"2300","CODENAME":"黑龙江"},
        "3100":{"CODEVALUE":"3100","CODENAME":"上海"},
        // "3110":{"CODEVALUE":"3110","CODENAME":"自贸区"},
        "3300":{"CODEVALUE":"3300","CODENAME":"浙江"},
        "3302":{"CODEVALUE":"3302","CODENAME":"宁波"},
        "3400":{"CODEVALUE":"3400","CODENAME":"安徽"},
        "3500":{"CODEVALUE":"3500","CODENAME":"福建"},
        "3502":{"CODEVALUE":"3502","CODENAME":"厦门"},
        "3600":{"CODEVALUE":"3600","CODENAME":"江西"},
        "3700":{"CODEVALUE":"3700","CODENAME":"山东"},
        "3702":{"CODEVALUE":"3702","CODENAME":"青岛"},
        "4100":{"CODEVALUE":"4100","CODENAME":"河南"},
        "4200":{"CODEVALUE":"4200","CODENAME":"湖北"},
        "4300":{"CODEVALUE":"4300","CODENAME":"湖南"},
        "4400":{"CODEVALUE":"4400","CODENAME":"广东"},
        "4403":{"CODEVALUE":"4403","CODENAME":"深圳"},
        "4500":{"CODEVALUE":"4500","CODENAME":"广西"},
        "4600":{"CODEVALUE":"4600","CODENAME":"海南"},
        "5000":{"CODEVALUE":"5000","CODENAME":"重庆"},
        "5100":{"CODEVALUE":"5100","CODENAME":"四川"},
        "5200":{"CODEVALUE":"5200","CODENAME":"贵州"},
        "5300":{"CODEVALUE":"5300","CODENAME":"云南"},
        "5400":{"CODEVALUE":"5400","CODENAME":"西藏"},
        "6100":{"CODEVALUE":"6100","CODENAME":"陕西"},
        "6200":{"CODEVALUE":"6200","CODENAME":"甘肃"},
        "6300":{"CODEVALUE":"6300","CODENAME":"青海"},
        "6400":{"CODEVALUE":"6400","CODENAME":"宁夏"},
        "6500":{"CODEVALUE":"6500","CODENAME":"新疆"}
    };

    /**
     * <p> 全国下拉框二级码基础配置key-value </p>
     * @param totalFlag 有无全国标识信息
     * @returns {*[]}
     */
    static getCompanyKeyValueListMap(totalFlag = true) {
        let ans = [];
        delete this.#COMPANY_KEY_VALUE_LIST_MAP["0000"];
        // 全国
        if (totalFlag) {
            this.#COMPANY_KEY_VALUE_LIST_MAP["0000"] = {"CODEVALUE":"0000","CODENAME": "全国"};
        }
        ans.push(this.#COMPANY_KEY_VALUE_LIST_MAP);
        return ans;
    }

    /**
     * <p> 全国/不包含全国 下拉框仅 key 数组</p>
     * <p> totalFlag = true 表示有全国标识 </p>
     * <p> totalFlag = false 表示没有全国标识 </p>
     * @returns {*[]}
     */
      static getCompanyKeyList(totalFlag = true) {
          // 全国下拉框二级码基础配置仅value
          let ans = [];
          Object.keys(this.#COMPANY_KEY_VALUE_LIST_MAP).forEach(key => {
              // 包含全国标识
              if (!totalFlag && key === "0000") {
                  // 不做处理（全国标识关闭、且当前是全国标识）
              } else {
                  ans.push(key);
              }
          });
          return ans;
      }

    /**
     * <p> 返回全国/不包含全国 映射二级码 </p>
     * <p> totalFlag = true 表示有全国标识 </p>
     * <p> totalFlag = false 表示没有全国标识 </p>
     * @returns {*[]}
     */
    static getCompanyKeyValueList(totalFlag = true) {
        // 全国下拉框二级码基础配置仅value
        let ans = [];
        Object.keys(this.#COMPANY_KEY_VALUE_LIST_MAP).forEach(key => {
            // 包含全国标识
            if (!totalFlag && key === "0000") {
                // 不做处理（全国标识关闭、且当前是全国标识）
            } else {
                ans.push(this.#COMPANY_KEY_VALUE_LIST_MAP[key]);
            }
        });
        return ans;
    }

    /**
     * <p> 通过 code 获取到对应的 code </p>
     * @param code
     * @returns {*[]}
     */
    static getCompanyValueByKey(code) {
        let tmpCode = code.substr(0, 4);
        let ans = [];
        Object.keys(this.#COMPANY_KEY_VALUE_LIST_MAP).some(key => {
            if (key === tmpCode) {
                ans.push(this.#COMPANY_KEY_VALUE_LIST_MAP[key]);
                return true;
            }
        });
        return ans;
    }
}
