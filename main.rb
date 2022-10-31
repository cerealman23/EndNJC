require 'csv'
# 1 -> year
# 4 -> county
# 5 -> total_pop 


class FormData

  def extract_county county

    county.split[0]

  end


  def data_based_on_year year
    final_struct = [] 
    csv = CSV.read("incarceration_trends.csv")
    total = 0

    # csv.each do | item |

    csv.each do | row |

      if row[1] == "2012"
        final_struct << [extract_county(row[4]), row[5]]
      end
    end

    # end

      final_struct

  end
  def write_to_csv data
    CSV.open("./county-prison.csv", "wb") do | csv |


      csv << ["county", "jail"] 
      data.each do | row |

        csv << [row[0], row[1]]

      end

    end
  end
end

form = FormData.new
form.write_to_csv(form.data_based_on_year "2012")
