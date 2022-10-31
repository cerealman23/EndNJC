require 'csv'
# 1 -> year
# 4 -> county
# 5 -> total_pop 


class FormData

  def extract_county county

    county.split[0]

  end


  def data_based_on_year year
    final_struct = {} 
    csv = CSV.read("incarceration_trends.csv")
    total = 0

    # csv.each do | item |

    csv.each do | row |

      if row[1] == "2012"
        final_struct[extract_county(row[4]).to_sym] = row[5]
      end
    end

    # end

      final_struct.length

  end
end

form = FormData.new
pp form.data_based_on_year "2012"
