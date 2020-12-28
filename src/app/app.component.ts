import { Component } from "@angular/core";
import { IDataHookResponse } from "@flatfile/adapter/build/main/obj.validation-response";
import FlatfileResults from "@flatfile/adapter/build/main/results";
import {
  FieldHookCallback,
  FlatfileMethods,
  ScalarDictionaryWithCustom
} from "@flatfile/angular";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements FlatfileMethods {
  title = "Flatfile Angular Demo";

  customer = { userId: "12345" };
  licenseKey = "License Key Here";
  settings = {
    type: "test import",
    fields: [
      { label: "Name", key: "name" },
      { label: "Email", key: "email" }
    ]
  };

  /*
   * @Input()'s
   */
  public fieldHooks: Record<string, FieldHookCallback> = {
    email: (values) => {
      return values.map(([item, index]) => [
        {
          value: item + "@",
          info: [{ message: "added @ after the email", level: "warning" }]
        },
        index
      ]);
    }
  };

  /*
   * 2-way binding handlers
   */
  onData(results: FlatfileResults): Promise<string> {
    let errorState = false;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (errorState) {
          reject("rejected - this text is controlled by the end-user");
          errorState = false;
        } else {
          resolve(
            "Flatfile upload successful - this text is controlled by the end-user"
          );
        }
      }, 3000);
    });
  }

  onRecordInit(
    record: ScalarDictionaryWithCustom,
    index: number
  ): IDataHookResponse | Promise<IDataHookResponse> {
    return {
      email: {
        value: record.email + "@",
        info: [{ message: "added @ on init", level: "info" }]
      }
    };
  }

  onRecordChange(
    record: ScalarDictionaryWithCustom,
    index: number
  ): IDataHookResponse | Promise<IDataHookResponse> {
    return {
      email: {
        value: record.email + "#",
        info: [{ message: "added # on change", level: "warning" }]
      }
    };
  }

  /*
   * @Output() handlers
   */
  onCancel(): void {
    console.log("canceled!");
  }
}
